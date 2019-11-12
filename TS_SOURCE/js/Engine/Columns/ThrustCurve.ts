namespace EngineEditableFieldMetadata {
    
    const chartWidth = 400 as const;
    const chartHeight = 400 as const;
    const defaultUpperBound = 150 as const;
    
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let style = getComputedStyle (document.body);
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
                updateLineChart (
                    chartLines.getContext ("2d")!,
                    getCurve (chartPoints, parseInt (upperBoundInput.value)),
                    style.getPropertyValue ("--tableLine"),
                    parseInt (upperBoundInput.value)
                );
            }
            
            chartPoints.addEventListener ("pointerdown", () => {
                setActivePoint (chartPoints, null);
            });
            
            chartPoints.addEventListener ("dblclick", (e: any) => {
                addPoint (chartPoints, e.layerX, e.layerY, false, updateLines, upperBoundInput);
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
                
                let burnTimeMultiplier = Engine.CalculateBurnTimeMultiplier (getCurve (chartPoints, parseInt (upperBoundInput.value)).map (([fuel, thrust]) => {
                    return [fuel * 100, thrust * 100];
                }));
                
                let upperBound = parseInt (upperBoundInput.value);
                points.forEach (p => {
                    if (p.hasAttribute ("valueY")) {
                        let thrust = parseFloat (p.getAttribute ("valueY")!);
                        thrust *= burnTimeMultiplier;
                        upperBound = Math.max (upperBound, thrust * 1.05);
                        p.setAttribute ("valueY", thrust.toString ());
                        p.style.top = `${ chartHeight - (chartHeight * thrust / parseInt (upperBoundInput.value)) - pointRadius }px`;
                    } else {
                        p.style.top = `${ Math.round (chartHeight - ((chartHeight - parseInt (p.style.top!)) * burnTimeMultiplier)) }px`;
                    }
                });
                
                upperBound = Math.round (upperBound);
                
                drawGrid (chartBackground.getContext ("2d")!, upperBound);
                repositionPointsAfterResize (
                    chartPoints,
                    parseInt (upperBoundInput.getAttribute ("previousValue")!),
                    upperBound
                );
                updateLines ();
                upperBoundInput.setAttribute ("previousValue", upperBound.toString ());
                upperBoundInput.value = upperBound.toString ();
                
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
            upperBoundInput.type = "number";
            upperBoundInput.min = "1";
            upperBoundInput.classList.add ("content-cell-content");
            upperBoundInput.classList.add ("upperBoundInput");
            upperBoundInput.style.gridArea = "c";
            detailsElement.appendChild (upperBoundInput);
            upperBoundInput.addEventListener ("keyup", () => {
                if (parseInt (upperBoundInput.value) <= 0) {
                    return;
                }
                
                drawGrid (chartBackground.getContext ("2d")!, parseInt (upperBoundInput.value));
                repositionPointsAfterResize (
                    chartPoints,
                    parseInt (upperBoundInput.getAttribute ("previousValue")!),
                    parseInt (upperBoundInput.value)
                );
                updateLines ();
                upperBoundInput.setAttribute ("previousValue", upperBoundInput.value);
            });
            upperBoundInput.addEventListener ("change", () => {
                if (parseInt (upperBoundInput.value) <= 0) {
                    upperBoundInput.value = defaultUpperBound.toString ();
                }
                
                drawGrid (chartBackground.getContext ("2d")!, parseInt (upperBoundInput.value));
                repositionPointsAfterResize (
                    chartPoints,
                    parseInt (upperBoundInput.getAttribute ("previousValue")!),
                    parseInt (upperBoundInput.value)
                );
                updateLines ();
                upperBoundInput.setAttribute ("previousValue", upperBoundInput.value);
            });
            upperBoundInput.addEventListener ("input", () => {
                upperBoundInput.setCustomValidity ("");
            });
            
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
            let chartBackground = e.querySelector<HTMLCanvasElement> (".chartBackground")!;
            let chartLines = e.querySelector<HTMLCanvasElement> (".chartLines")!;
            let upperBoundInput = e.querySelector<HTMLInputElement> (".upperBoundInput")!;
            let style = getComputedStyle (document.body);
            
            let upperBound = defaultUpperBound as number;
            engine.ThrustCurve.forEach (([fuel, thrust]) => {
                upperBound = Math.max (upperBound, thrust * 1.05);
            });
            upperBound = Math.round (upperBound);
            
            upperBoundInput.setAttribute ("previousValue", upperBound.toString ());
            upperBoundInput.value = upperBound.toString ();
            
            let canvas = chartBackground.getContext ("2d")!;
            drawGrid (canvas, upperBound);
            
            container.innerHTML = "";
            
            const updateLines = () => {
                updateLineChart (chartLines.getContext ("2d")!, getCurve (container, parseInt (upperBoundInput.value)), style.getPropertyValue ("--tableLine"), parseInt (upperBoundInput.value));
            }
            
            engine.ThrustCurve.forEach (([fuel, thrust]) => {
                addPoint (
                    container,
                    fuel,
                    thrust,
                    true,
                    updateLines,
                    upperBoundInput
                );
            });
            
            updateLines ();
        }, ApplyChangesToValue: (e, engine) => {
            engine.ThrustCurve = getCurve (
                e.querySelector<HTMLDivElement> (".chartPoints")!,
                parseInt (e.querySelector<HTMLInputElement> (".upperBoundInput")!.value)
            ).map (
                ([fuel, thrust]) => [fuel * 100, thrust * 100]
            );
        },
    };
    
    const repositionPointsAfterResize = (
        container: HTMLDivElement,
        oldUpperBound: number,
        newUpperBound: number
    ) => {
        container.querySelectorAll<HTMLDivElement> (".chartPoint").forEach (p => {
            if (p.hasAttribute ("valueY")) {
                p.style.top = `${ Math.round (chartHeight - chartHeight * parseFloat (p.getAttribute ("valueY")!) / newUpperBound) - pointRadius }px`;
            } else {
                p.style.top = `${ Math.round (chartHeight - ((chartHeight - parseInt (p.style.top!)) * oldUpperBound / newUpperBound)!) }px`;
            }
        });
    }
    
    const drawGrid = (
        canvas: CanvasRenderingContext2D,
        upperBound: number
    ) => {
        let style = getComputedStyle (document.body);
        
        const getLine = (yValue: number, color: string) => {
            return {
                Position: 400 - Math.round (chartHeight * yValue / upperBound),
                Width: 1,
                Color: color,
                Label: `${ yValue }%`
            } as LineData;
        }
        let linesY: LineData[] = [];
        
        linesY.push (getLine (50, style.getPropertyValue ("--tableDistinct")));
        linesY.push (getLine (100, style.getPropertyValue ("--tableRed")));
        
        for (let i = 200; i < upperBound; i += 100) {
            linesY.push (getLine (i, style.getPropertyValue ("--tableRegular")));
        }
        
        CanvasHelper.DrawGrid (
            0, 0,
            chartWidth - 1, chartHeight - 1,
            9, 0, true,
            canvas, style.getPropertyValue ("--tableRegular"), 1,
            { 5: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" } },
            undefined,
            { Color: style.getPropertyValue ("--tableBorder"), Width: 1 },
            "Fuel", "Thrust",
            undefined, linesY
        );
    }
    
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
        startIsExactValue: boolean,
        onDrag: () => void,
        upperBoundInput: HTMLInputElement,
    ) => {
        const saveAccurateValue = (x: number, y: number) => {
            newPoint.setAttribute ("valueX", (100 * (x + pointRadius) / chartWidth).toString ());
            newPoint.setAttribute ("valueY", ((chartHeight - y - pointRadius) * parseInt (upperBoundInput.value) / chartHeight).toString ());
        }
        
        let newPoint = document.createElement ("div");
        newPoint.classList.add ("chartPoint");
        
        if (startIsExactValue) {
            let xPos = startX * chartWidth / 100;
            let yPos = chartHeight - startY * chartHeight / parseInt (upperBoundInput.value);
            
            newPoint.style.left = `${ xPos - pointRadius }px`;
            newPoint.style.top = `${ yPos - pointRadius }px`;
            
            newPoint.setAttribute ("valueX", startX.toString ());
            newPoint.setAttribute ("valueY", startY.toString ());
        } else {
            newPoint.style.left = `${ startX - pointRadius }px`;
            newPoint.style.top = `${ startY - pointRadius }px`;
            saveAccurateValue (startX - pointRadius, startY - pointRadius);
        }
        
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
                
                // Don't override with a potencially less accurate value on click
                if (newX != originalX || newY != originalY) {
                    saveAccurateValue (newX, newY);
                }
                
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
    
    function getCurve (pointContainer: HTMLElement, upperBound: number): [number, number][] {
        let pointElements = pointContainer.querySelectorAll<HTMLDivElement> ("div.chartPoint");
        let points: [boolean, number, number][] = [];
        let output: [number, number][] = [];
        
        pointElements.forEach (e => {
            if (e.hasAttribute ("valueX") && e.hasAttribute ("valueY")) {
                points.push ([
                    true,
                    parseFloat (e.getAttribute ("valueX")!),
                    parseFloat (e.getAttribute ("valueY")!)
                ]);
            } else {
                points.push ([
                    false,
                    parseInt (e.style.left!),
                    parseInt (e.style.top!)
                ]);
            }
        });
        
        points.forEach (([final, rawFuel, rawThrust]) => {
            if (final) {
                output.push ([
                    rawFuel / 100,
                    rawThrust / 100
                ]);
                return; // continue
            }
            
            output.push ([
                (rawFuel + pointRadius) / chartWidth,
                (1 - (rawThrust + pointRadius) / chartHeight) * upperBound / 100
            ]);
        });
        
        output = output.sort ((a, b) => a[0] - b[0]);
        
        return output;
    }
    
    const updateLineChart = (
        lineChart: CanvasRenderingContext2D,
        points: [number, number][],
        color: string,
        upperBound: number
    ) => {
        lineChart.clearRect (0, 0, chartWidth, chartHeight);
        
        lineChart.beginPath ();
        lineChart.strokeStyle = color;
        
        if (points.length == 0) {
            lineChart.moveTo (0, chartHeight / (upperBound / 100));
            lineChart.lineTo (chartWidth, chartHeight / (upperBound / 100));
            return;
        } else {
            lineChart.moveTo (0, chartHeight - points[0][1] * chartHeight / (upperBound / 100));
            
            for (let i = 0; i < points.length; ++i) {
                lineChart.lineTo (points [i][0] * chartWidth, chartHeight - points[i][1] * chartHeight / (upperBound / 100));
            }
            
            lineChart.lineTo (chartWidth, chartHeight - points[points.length - 1][1] * chartHeight / (upperBound / 100));
        }
        
        lineChart.stroke ();
        lineChart.closePath ();
    }
}