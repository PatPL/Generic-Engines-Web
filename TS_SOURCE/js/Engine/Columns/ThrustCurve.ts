namespace EngineEditableFieldMetadata {
    
    let chartWidth = 400;
    let chartHeight = 400;
    const defaultUpperBound = 150 as const;
    let pointerIDcounter = 1;
    
    export const ThrustCurve: IEditable<Engine> = {
        ApplyValueToDisplayElement: (e, engine) => {
            e.innerHTML = engine.ThrustCurve.length > 0 ? `Custom: ${ engine.GetThrustCurveBurnTimeMultiplier ().toFixed (3) } * Burn time` : "Default";
        }, GetEditElement: () => {
            let style = getComputedStyle (document.body);
            let tmp = document.createElement ("div");
            
            tmp.style.width = "100%";
            tmp.style.height = `${ /* Chart element */ 417 + /* Details element */ 232 }px`;
            
            // Typescript doesn't know what ResizeObserver is
            // @ts-ignore
            new ResizeObserver (() => {
                chartWidth = tmp.offsetWidth - 16;
                
                chartBackground.width = chartWidth;
                chartLines.width = chartWidth;
                
                drawGrid (chartBackground.getContext ("2d")!, parseInt (upperBoundInput.value));
                repositionPointsAfterResize (chartPoints, upperBoundInput, chartTable);
                
                updateLines ();
            }).observe (tmp);
            
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
                setActivePoint (chartPoints, null, chartTable);
            });
            
            chartPoints.addEventListener ("dblclick", (e: any) => {
                addPoint (chartPoints, chartTable, e.layerX, e.layerY, false, updateLines, upperBoundInput);
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
                
                if (burnTimeMultiplier == Infinity) {
                    Notifier.Warn ("Curve that achieves 0% thrust at any point can't be normalized (Infinite burn time)", 5000);
                    return;
                }
                
                let upperBound = parseInt (upperBoundInput.value);
                points.forEach (p => {
                    let thrust = parseFloat (p.getAttribute ("valueY")!);
                    thrust *= burnTimeMultiplier;
                    upperBound = Math.max (upperBound, thrust * 1.05);
                    
                    movePoint (
                        p,
                        parseFloat (p.getAttribute ("valueX")!),
                        thrust,
                        true,
                        upperBoundInput,
                        chartTable.querySelector<HTMLElement> (`.chartTableRow[pointID="${ p.getAttribute ("pointID") }"]`)!,
                        true
                    );
                });
                
                upperBound = Math.round (upperBound);
                upperBoundInput.setAttribute ("previousValue", upperBoundInput.value);
                upperBoundInput.value = upperBound.toString ();
                
                drawGrid (chartBackground.getContext ("2d")!, upperBound);
                repositionPointsAfterResize (chartPoints, upperBoundInput, chartTable);
                
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
                    removePoint (point, chartTable);
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
                if (isNaN (parseInt (upperBoundInput.value)) || parseInt (upperBoundInput.value) <= 0) {
                    return;
                }
                
                drawGrid (chartBackground.getContext ("2d")!, parseInt (upperBoundInput.value));
                repositionPointsAfterResize (chartPoints, upperBoundInput, chartTable);
                updateLines ();
            });
            upperBoundInput.addEventListener ("change", () => {
                if (isNaN (parseInt (upperBoundInput.value)) || parseInt (upperBoundInput.value) <= 0) {
                    upperBoundInput.value = defaultUpperBound.toString ();
                }
                
                drawGrid (chartBackground.getContext ("2d")!, parseInt (upperBoundInput.value));
                repositionPointsAfterResize (chartPoints, upperBoundInput, chartTable);
                updateLines ();
            });
            
            let upperBoundLabel = document.createElement ("span");
            upperBoundLabel.classList.add ("abbr");
            upperBoundInput.classList.add ("upperBoundLabel");
            upperBoundLabel.innerHTML = "% Thrust upper bound";
            upperBoundLabel.title = "Highest thrust value on the chart";
            upperBoundLabel.style.gridArea = "d";
            detailsElement.appendChild (upperBoundLabel);
            
            let chartTableContainer = document.createElement ("div");
            chartTableContainer.classList.add ("chartTableContainer");
            chartTableContainer.style.gridArea = "e";
            detailsElement.appendChild (chartTableContainer);
            
            let chartTable = document.createElement ("table");
            chartTable.classList.add ("chartTable");
            chartTableContainer.appendChild (chartTable);
            
            chartTable.innerHTML = `
                <col width="*">
                <col width="*">
                <col width="24">
                <tr>
                    <th>Fuel%</th>
                    <th>Thrust%</th>
                    <th></th>
                </tr>
            `;
            
            return tmp;
        }, ApplyValueToEditElement: (e, engine) => {
            let container = e.querySelector<HTMLDivElement> (".chartPoints")!;
            let chartBackground = e.querySelector<HTMLCanvasElement> (".chartBackground")!;
            let chartLines = e.querySelector<HTMLCanvasElement> (".chartLines")!;
            let upperBoundInput = e.querySelector<HTMLInputElement> (".upperBoundInput")!;
            let chartTable = e.querySelector<HTMLTableElement> (".chartTable")!;
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
            chartTable.children[1].querySelectorAll (".chartTableRow").forEach (r => {
                r.remove ();
            });
            
            const updateLines = () => {
                updateLineChart (
                    chartLines.getContext ("2d")!,
                    getCurve (container, parseInt (upperBoundInput.value)),
                    style.getPropertyValue ("--tableLine"),
                    parseInt (upperBoundInput.value)
                );
            }
            
            for (let i = 0; i < engine.ThrustCurve.length; ++i) {
                // fix the 0.30000000000000004 kind of stuff for display
                const FLOATING_POINT_FIX_ACCURACY = 8;
                let fuel = Math.round (engine.ThrustCurve[i][0] * (10 ** FLOATING_POINT_FIX_ACCURACY)) / (10 ** FLOATING_POINT_FIX_ACCURACY);
                let thrust = Math.round (engine.ThrustCurve[i][1] * (10 ** FLOATING_POINT_FIX_ACCURACY)) / (10 ** FLOATING_POINT_FIX_ACCURACY);
                addPoint (
                    container,
                    chartTable,
                    fuel,
                    thrust,
                    true,
                    updateLines,
                    upperBoundInput
                );
            }
            
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
    
    const movePoint = (
        point: HTMLDivElement,
        x: number,
        y: number,
        xyIsValue: boolean,
        upperBoundInput: HTMLInputElement,
        chartTableRow: HTMLElement,
        updateTableRowInput: boolean
    ) => {
        if (xyIsValue) {
            let xPos = chartWidth - x * chartWidth / 100;
            let yPos = chartHeight - y * chartHeight / parseInt (upperBoundInput.value);
            
            point.style.left = `${ xPos - pointRadius }px`;
            point.style.top = `${ yPos - pointRadius }px`;
            
            point.setAttribute ("valueX", x.toString ());
            point.setAttribute ("valueY", y.toString ());
            
            updateTableRow (chartTableRow, x, y, updateTableRowInput);
        } else {
            point.style.left = `${ x - pointRadius }px`;
            point.style.top = `${ y - pointRadius }px`;
            
            let actualValueX = (100 - 100 * (x) / chartWidth);
            let actualValueY = ((chartHeight - y) * parseInt (upperBoundInput.value) / chartHeight);
            
            point.setAttribute ("valueX", actualValueX.toString ());
            point.setAttribute ("valueY", actualValueY.toString ());
            
            updateTableRow (chartTableRow, actualValueX, actualValueY, updateTableRowInput);
        }
    }
    
    const updateTableRow = (
        chartTableRow: HTMLElement,
        xValue: number,
        yValue: number,
        updateInputFields: boolean
    ) => {
        let inputs = chartTableRow.querySelectorAll ("input");
        
        if (inputs.length != 2) {
            console.error ("Bad table row:", chartTableRow, inputs);
            return;
        }
        
        if (updateInputFields) {
            // Fuel%
            inputs[0].value = xValue.toString ();
            
            // Thrust%
            inputs[1].value = yValue.toString ();
        }
        
        //Resort the columns
        sortChartTableRows (chartTableRow.parentElement!);
    }
    
    const sortChartTableRows = (chartTable: HTMLElement) => {
        let rows: [HTMLElement, number][] = [];
        chartTable.querySelectorAll<HTMLElement> (".chartTableRow").forEach (r => {
            // r.querySelector ("input") is the Fuel% input
            
            let value = parseFloat (r.querySelector ("input")!.value);
            value = isNaN (value) ? 0 : value;
            
            rows.push ([r, value]);
        });
        
        rows.sort ((a, b) =>  {
            let output = b[1] - a[1];
            
            if (output == 0) {
                output = parseInt (a[0].getAttribute ("pointID")!) - parseInt (b[0].getAttribute ("pointID")!)
            }
            
            return output;
        });
        
        let activeElementBackup = document.activeElement as HTMLElement | null;
        rows.forEach (([row, _]) => {
            chartTable.appendChild (row);
        });
        if (activeElementBackup) { activeElementBackup.focus (); }
    }
    
    const repositionPointsAfterResize = (
        container: HTMLDivElement,
        upperBoundInput: HTMLInputElement,
        chartTable: HTMLTableElement
    ) => {
        container.querySelectorAll<HTMLDivElement> (".chartPoint").forEach (p => {
            movePoint (
                p,
                parseFloat (p.getAttribute ("valueX")!),
                parseFloat (p.getAttribute ("valueY")!),
                true,
                upperBoundInput,
                chartTable.querySelector<HTMLElement> (`.chartTableRow[pointID="${ p.getAttribute ("pointID") }"]`)!,
                true
            );
        });
        
        upperBoundInput.setAttribute ("previousValue", upperBoundInput.value);
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
        linesY.push (getLine (150, style.getPropertyValue ("--tableRegular")));
        
        if (upperBound <= 200) {
            for (let i = 10; i < 200; i += 10) {
                if (i == 50 || i == 100 || i == 150) { continue; }
                
                linesY.push (getLine (i, style.getPropertyValue ("--tableRegular")));
            }
        } else {
            for (let i = 200; i < upperBound; i += 100) {
                linesY.push (getLine (i, style.getPropertyValue ("--tableRegular")));
            }
        }
        
        CanvasHelper.DrawGrid (
            0, 0,
            chartWidth - 1, chartHeight - 1,
            9, 0, true,
            canvas, style.getPropertyValue ("--tableRegular"), 1,
            {
                2: { Color: style.getPropertyValue ("--tableRegular"), Label: "80%" },
                5: { Color: style.getPropertyValue ("--tableDistinct"), Label: "50%" },
                8: { Color: style.getPropertyValue ("--tableRegular"), Label: "20%" }
            },
            undefined,
            { Color: style.getPropertyValue ("--tableBorder"), Width: 1 },
            "Fuel", "Thrust",
            undefined, linesY
        );
    }
    
    const setActivePoint = (
        container: HTMLElement,
        activePoint: HTMLElement | null,
        chartTable: HTMLElement
    ) => {
        if (activePoint && activePoint.parentElement != container) {
            console.warn ("This point isn't a direct child to given container", activePoint, container);
        }
        
        //
        
        container.querySelectorAll (".chartPointActive").forEach (p => {
            p.classList.remove ("chartPointActive");
        });
        
        chartTable.querySelectorAll (".chartTableRowActive").forEach (r => {
            r.classList.remove ("chartTableRowActive");
        });
        
        //
        
        if (activePoint) {
            activePoint.classList.add ("chartPointActive");
            
            let tableRow = chartTable.querySelector (`.chartTableRow[pointID="${ activePoint.getAttribute ("pointID") }"]`);
            if (tableRow) {
                tableRow.classList.add ("chartTableRowActive");
            }
        }
    }
    
    function getActivePoint (container: HTMLElement): HTMLDivElement | null {
        return container.querySelector<HTMLDivElement> (".chartPointActive");
    }
    
    const removePoint = (
        point: HTMLDivElement,
        chartTable: HTMLTableElement
    ) => {
        if (confirm ("You are about to remove a thrust curve point. Are you sure?")) {
            point.remove ();
            
            let tableRow = chartTable.querySelector<HTMLElement> (`.chartTableRow[pointID="${ point.getAttribute ("pointID") }"]`);
            if (tableRow) {
                tableRow.remove ();
            }
        }
    }
    
    const pointRadius = 5;
    const addPoint = (
        container: HTMLElement,
        chartTable: HTMLTableElement,
        startX: number,
        startY: number,
        startIsExactValue: boolean,
        onValueUpdate: () => void,
        upperBoundInput: HTMLInputElement,
    ) => {
        let newPoint = document.createElement ("div");
        newPoint.classList.add ("chartPoint");
        
        // Table row
        
        let newRow = document.createElement ("tr");
        newRow.classList.add ("chartTableRow");
        newRow.setAttribute ("pointID", pointerIDcounter.toString ());
        
        newRow.innerHTML = `
            <td><input class="chartTableRowInput content-cell-content"></td>
            <td><input class="chartTableRowInput content-cell-content"></td>
            <td style="font-size: 0;">
                <img src="svg/button/remove-mid.svg" class="chartTableRowButton medium-button option-button">
            </td>
        `;
        
        let tableInputs = newRow.querySelectorAll ("input");
        let fuelInput = tableInputs[0];
        let thrustInput = tableInputs[1];
        
        let tableButtons = newRow.querySelectorAll ("img");
        let removeButton = tableButtons[0];
        
        fuelInput.addEventListener ("keyup", () => {
            let newValueX = fuelInput.value == "" ? 0 : parseFloat (fuelInput.value);
            
            if (!isNaN (newValueX)) {
                movePoint (
                    newPoint,
                    newValueX,
                    parseFloat (newPoint.getAttribute ("valueY")!),
                    true,
                    upperBoundInput,
                    newRow,
                    false
                );
                
                onValueUpdate ();
            }
        });
        
        thrustInput.addEventListener ("keyup", () => {
            let newValueY = thrustInput.value == "" ? 0 : parseFloat (thrustInput.value);
            
            if (!isNaN (newValueY)) {
                movePoint (
                    newPoint,
                    parseFloat (newPoint.getAttribute ("valueX")!),
                    newValueY,
                    true,
                    upperBoundInput,
                    newRow,
                    false
                );
                
                onValueUpdate ();
            }
        });
        
        fuelInput.addEventListener ("focusin", () => { setActivePoint (container, newPoint, chartTable); });
        // fuelInput.addEventListener ("focusout", () => { setActivePoint (container, null, chartTable); });
        thrustInput.addEventListener ("focusin", () => { setActivePoint (container, newPoint, chartTable); });
        // thrustInput.addEventListener ("focusout", () => { setActivePoint (container, null, chartTable); });
        
        removeButton.addEventListener ("click", () => {
            removePoint (newPoint, chartTable);
            onValueUpdate ();
        });
        
        // children[0] because of the hidden <colgroup> and <tbody> elements
        // (insert into <tbody>)
        chartTable.children[1].appendChild (newRow);
        
        //
        
        newPoint.setAttribute ("pointID", pointerIDcounter.toString ());
        movePoint (
            newPoint,
            startX,
            startY,
            startIsExactValue,
            upperBoundInput,
            newRow,
            true
        );
        
        container.appendChild (newPoint);
        setActivePoint (container, newPoint, chartTable);
        
        newPoint.addEventListener ("pointerdown", e => {
            e.stopImmediatePropagation ();
            
            let startX = Input.MouseX - pointRadius;
            let startY = Input.MouseY - pointRadius;
            let originalX = parseInt (newPoint.style.left!);
            let originalY = parseInt (newPoint.style.top!);
            
            setActivePoint (container, newPoint, chartTable);
            
            Dragger.Drag (() => {
                let newX = Math.min (Math.max (originalX + Input.MouseX - startX, 0), chartWidth);
                let newY = Math.min (Math.max (originalY + Input.MouseY - startY, 0), chartHeight);
                
                // Don't override with a potencially less accurate value on click
                if (
                    newX != originalX + pointRadius ||
                    newY != originalY + pointRadius
                ) {
                    movePoint (
                        newPoint,
                        newX,
                        newY,
                        false,
                        upperBoundInput,
                        newRow,
                        true
                    );
                    
                    onValueUpdate ();
                }
            });
        });
        
        newPoint.addEventListener ("dblclick", e => {
            e.preventDefault ();
            e.stopImmediatePropagation ();
        });
        
        ++pointerIDcounter;
    }
    
    function getCurve (pointContainer: HTMLElement, upperBound: number): [number, number][] {
        let pointElements = pointContainer.querySelectorAll<HTMLDivElement> ("div.chartPoint");
        let points: [boolean, number, number, number][] = [];
        let finalPoints: [number, number, number][] = [];
        let output: [number, number][] = [];
        
        pointElements.forEach (e => {
            if (e.hasAttribute ("valueX") && e.hasAttribute ("valueY")) {
                points.push ([
                    true,
                    parseFloat (e.getAttribute ("valueX")!),
                    parseFloat (e.getAttribute ("valueY")!),
                    parseInt (e.getAttribute ("pointID")!)
                ]);
            } else {
                points.push ([
                    false,
                    parseInt (e.style.left!),
                    parseInt (e.style.top!),
                    parseInt (e.getAttribute ("pointID")!)
                ]);
            }
        });
        
        points.forEach (([final, rawFuel, rawThrust, pointID]) => {
            if (final) {
                finalPoints.push ([
                    rawFuel / 100,
                    rawThrust / 100,
                    pointID
                ]);
                return; // continue
            }
            
            finalPoints.push ([
                (rawFuel + pointRadius) / chartWidth,
                (1 - (rawThrust + pointRadius) / chartHeight) * upperBound / 100,
                pointID
            ]);
        });
        
        output = finalPoints.sort ((a, b) => {
            if (a[0] - b[0] != 0) {
                return b[0] - a[0];
            } else {
                return a[2] - b[2];
            }
        }).map (([fuel, thrust, _]) => [fuel, thrust]);
        
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
                lineChart.lineTo (chartWidth - points [i][0] * chartWidth, chartHeight - points[i][1] * chartHeight / (upperBound / 100));
            }
            
            lineChart.lineTo (chartWidth, chartHeight - points[points.length - 1][1] * chartHeight / (upperBound / 100));
        }
        
        lineChart.stroke ();
        lineChart.closePath ();
    }
}