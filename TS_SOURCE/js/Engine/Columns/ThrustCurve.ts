namespace EngineEditableFieldMetadata {
    
    const chartWidth = 400;
    const chartHeight = 400;
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            
            tmp.style.width = "416px";
            tmp.style.height = "500px";
            
            let chartElement = document.createElement ("div");
            chartElement.classList.add ("chartElement");
            
            // === Static background, separated to not redraw it on update
            let chartBackground = document.createElement ("canvas");
            chartBackground.classList.add ("chartBackground");
            chartBackground.width = chartWidth;
            chartBackground.height = chartHeight;
            chartElement.appendChild (chartBackground);
            
            let canvas = chartBackground.getContext ("2d")!;
            let style = getComputedStyle (document.body);
            CanvasHelper.DrawGrid (
                0, 0,
                chartWidth - 1, chartHeight - 1,
                9, 3, true,
                canvas, style.getPropertyValue ("--tableRegular"), 1,
                { 5: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" } },
                { 2: { Color: style.getPropertyValue ("--tableRed"), Width: 1, Label: "100%" }, 3: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" } },
                { Color: style.getPropertyValue ("--tableBorder"), Width: 3 },
                "Fuel", "Thrust"
            );
            
            tmp.appendChild (chartElement);
            // !== Static background
            // === Dynamic foreground: Lines on canvas
            let chartLines = document.createElement ("canvas");
            chartLines.classList.add ("chartLines");
            chartLines.height = chartHeight;
            chartLines.width = chartWidth;
            chartElement.appendChild (chartLines);
            // !== Dynamic foreground
            // === Point container
            let chartPoints = document.createElement ("div");
            chartPoints.classList.add ("chartPoints");
            chartElement.appendChild (chartPoints);
            
            const updateLines = () => {
                updateLineChart (chartLines.getContext ("2d")!, getCurve (chartPoints));
            }
            
            chartPoints.addEventListener ("dblclick", (e: any) => {
                addPoint (chartPoints, e.layerX, e.layerY, updateLines);
                updateLines ();
            });
            
            chartPoints.addEventListener ("pointerdown", e => {
                if (e.which == 1) {
                    console.log (getCurve (chartPoints));
                }
            })
            // !== Point container
            
            //tmp
            updateLines ();
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            
        }, ApplyChangesToValue: (e, engine) => {
            
        },
    };
    
    const pointRadius = 5;
    const addPoint = (
        container: HTMLElement,
        startX: number,
        startY: number,
        onDrag: () => void
    ) => {
        let newPoint = document.createElement ("div");
        newPoint.classList.add ("chartPoint");
        
        newPoint.style.left = `${ startX - pointRadius }px`;
        newPoint.style.top = `${ startY - pointRadius }px`;
        
        container.appendChild (newPoint);
        
        newPoint.addEventListener ("pointerdown", e => {
            let startX = Input.MouseX;
            let startY = Input.MouseY;
            let originalX = parseInt (newPoint.style.left!);
            let originalY = parseInt (newPoint.style.top!);
            
            Dragger.Drag (() => {
                let newX = Math.min (Math.max (originalX + Input.MouseX - startX, -pointRadius), chartWidth - pointRadius);
                let newY = Math.min (Math.max (originalY + Input.MouseY - startY, -pointRadius), chartHeight - pointRadius);
                
                newPoint.style.left = `${ newX }px`;
                newPoint.style.top = `${ newY }px`;
                
                onDrag ();
            });
        });
        
        newPoint.addEventListener ("dblclick", e => {
            e.preventDefault ();
            e.stopImmediatePropagation ();
        })
    }
    
    function getCurve (pointContainer: HTMLElement): [number, number][] {
        let pointElements = pointContainer.querySelectorAll<HTMLDivElement> ("div.chartPoint");
        let points: [number, number][] = [];
        let output: [number, number][] = [];
        
        pointElements.forEach (e => {
            points.push ([
                parseInt (e.style.left!),
                parseInt (e.style.top!)
            ]);
        });
        
        points.forEach (([rawFuel, rawThrust]) => {
            output.push ([
                (rawFuel + pointRadius) / chartWidth,
                (1 - (rawThrust + pointRadius) / chartHeight) * 2
            ]);
        });
        
        output = output.sort ((a, b) => a[0] - b[0]);
        
        return output;
    }
    
    const updateLineChart = (
        lineChart: CanvasRenderingContext2D,
        points: [number, number][]
    ) => {
        lineChart.clearRect (0, 0, chartWidth, chartHeight);
        
        if (points.length == 0) {
            lineChart.moveTo (0, chartHeight / 2);
            lineChart.lineTo (chartWidth, chartHeight / 2);
            return;
        }
        
        lineChart.beginPath ();
        lineChart.moveTo (0, chartHeight - points[0][1] * chartHeight / 2);
        
        for (let i = 0; i < points.length; ++i) {
            lineChart.lineTo (points [i][0] * chartWidth, chartHeight - points[i][1] * chartHeight / 2);
        }
        
        lineChart.lineTo (chartWidth, chartHeight - points[points.length - 1][1] * chartHeight / 2);
        lineChart.stroke ();
        lineChart.closePath ();
    }
}