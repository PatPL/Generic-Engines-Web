namespace EngineEditableFieldMetadata {
    
    const chartWidth = 400;
    const chartHeight = 400;
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let tmp = document.createElement ("div");
            
            tmp.style.width = "416px";
            tmp.style.height = `${ /* Chart element */ 417 + /* Details element */ 200 }px`;
            
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
                updateLineChart (chartLines.getContext ("2d")!, getCurve (chartPoints), style.getPropertyValue ("--tableLine"));
            }
            
            chartPoints.addEventListener ("pointerdown", () => {
                setActivePoint (chartPoints, null);
            });
            
            chartPoints.addEventListener ("dblclick", (e: any) => {
                addPoint (chartPoints, e.layerX, e.layerY, updateLines);
                updateLines ();
            });
            // !== Point container
            
            let detailsElement = document.createElement ("div");
            detailsElement.classList.add ("chartDetails");
            tmp.appendChild (detailsElement);
            
            let chartNormalizeButton = document.createElement ("button");
            chartNormalizeButton.classList.add ("abbr");
            chartNormalizeButton.classList.add ("chartNormalizeButton");
            chartNormalizeButton.style.gridArea = "a";
            chartNormalizeButton.innerHTML = "Normalize"
            chartNormalizeButton.title = "Move the points on the chart to change burn time multiplier to 1, keeping current curve shape";
            chartNormalizeButton.addEventListener ("click", () => {
                let points = chartPoints.querySelectorAll<HTMLDivElement> (".chartPoint");
                
                // Repeat a few times for better accuracy
                // Maybe change the magic 5 into a setting?
                for (let i = 0; i < 5; ++i) {
                    let burnTimeMultiplier = Engine.CalculateBurnTimeMultiplier (getCurve (chartPoints).map (([fuel, thrust]) => {
                        return [fuel * 100, thrust * 100];
                    }));
                    
                    points.forEach (p => {
                        p.style.top = `${ Math.round (chartHeight - ((chartHeight - parseInt (p.style.top!)) * burnTimeMultiplier)) }px`
                    });
                }
                
                updateLines ();
            });
            detailsElement.appendChild (chartNormalizeButton);
            
            let chartRemovePointButton = document.createElement ("button");
            chartRemovePointButton.classList.add ("chartRemovePointButton");
            chartRemovePointButton.style.gridArea = "b";
            chartRemovePointButton.innerHTML = "Delete selected point";
            chartRemovePointButton.addEventListener ("click", () => {
                let point = getActivePoint (chartPoints);
                
                if (point) {
                    point.remove ();
                    updateLines ();
                }
            });
            detailsElement.appendChild (chartRemovePointButton);
            
            let upperBoundInput = document.createElement ("input");
            upperBoundInput.classList.add ("content-cell-content");
            upperBoundInput.classList.add ("upperBoundInput");
            upperBoundInput.style.gridArea = "c";
            upperBoundInput.value = "200";
            detailsElement.appendChild (upperBoundInput);
            
            let upperBoundLabel = document.createElement ("span");
            upperBoundLabel.classList.add ("abbr");
            upperBoundInput.classList.add ("upperBoundLabel");
            upperBoundLabel.innerHTML = "% Thrust upper bound";
            upperBoundLabel.title = "Highest thrust value on the chart";
            upperBoundLabel.style.gridArea = "d";
            detailsElement.appendChild (upperBoundLabel);
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let container = e.querySelector<HTMLDivElement> (".chartPoints")!;
            let chartLines = e.querySelector<HTMLCanvasElement> (".chartLines")!;
            let style = getComputedStyle (document.body);
            
            container.innerHTML = "";
            
            const updateLines = () => {
                updateLineChart (chartLines.getContext ("2d")!, getCurve (container), style.getPropertyValue ("--tableLine"));
            }
            
            engine.ThrustCurve.forEach (([fuel, thrust]) => {
                addPoint (container, chartWidth * fuel / 100, chartHeight - chartHeight * thrust / 200, updateLines);
            });
            
            updateLines ();
        }, ApplyChangesToValue: (e, engine) => {
            engine.ThrustCurve = getCurve (e.querySelector<HTMLDivElement> (".chartPoints")!).map (
                ([fuel, thrust]) => [fuel * 100, thrust * 100]
            );
        },
    };
    
    const setActivePoint = (
        container: HTMLElement,
        activePoint: HTMLElement | null
    ) => {
        if (activePoint && activePoint.parentElement != container) {
            console.warn ("This point isn't a direct child to given container", activePoint, container);
        }
        
        container.querySelectorAll (".chartPointActive").forEach (p => {
            p.classList.remove ("chartPointActive");
        });
        
        if (activePoint) {
            activePoint.classList.add ("chartPointActive");
        }
    }
    
    function getActivePoint (container: HTMLElement): HTMLElement | null {
        return container.querySelector<HTMLElement> (".chartPointActive");
    }
    
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
        setActivePoint (container, newPoint);
        
        newPoint.addEventListener ("pointerdown", e => {
            e.stopImmediatePropagation ();
            
            let startX = Input.MouseX;
            let startY = Input.MouseY;
            let originalX = parseInt (newPoint.style.left!);
            let originalY = parseInt (newPoint.style.top!);
            
            setActivePoint (container, newPoint);
            
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
        points: [number, number][],
        color: string
    ) => {
        lineChart.clearRect (0, 0, chartWidth, chartHeight);
        
        lineChart.beginPath ();
        lineChart.strokeStyle = color;
        
        if (points.length == 0) {
            lineChart.moveTo (0, chartHeight / 2);
            lineChart.lineTo (chartWidth, chartHeight / 2);
            return;
        } else {
            lineChart.moveTo (0, chartHeight - points[0][1] * chartHeight / 2);
            
            for (let i = 0; i < points.length; ++i) {
                lineChart.lineTo (points [i][0] * chartWidth, chartHeight - points[i][1] * chartHeight / 2);
            }
            
            lineChart.lineTo (chartWidth, chartHeight - points[points.length - 1][1] * chartHeight / 2);
        }
        
        lineChart.stroke ();
        lineChart.closePath ();
    }
}