class DynamicProgramming {
    constructor (data) {
        for (let key in data) {
            this[key] = data[key];
        }
        this.tablesData = [];
        this.optimalReserve = [];

        // Time passed counting
        this.timeCount = {
            start: 0,
            finish: 0
        };
    }


    init () {
        this.timeCount.start = new Date();

        this.limitsNum = this.limits.length;
        this.systemsNum = this.limits[0].coefs.length;

        if (this.checkInputData()) {
            this.run();
        } else {
            console.error('Something wrong with input data');
        }
    }


    run () {
        this.limitsBounds = this.getLimitsMaxArray(this.limits);

        for (let i = this.systemsNum - 1; i >= 0; i--) {
            this['buildTableMainData' + this.limitsNum](i, this.limitsBounds);
        }

        this.optimalReserve = this.getOptimalReserve();

        this.timeCount.finish = new Date();
        console.log('Час виконання алгоритму динамічного програмування: ' +
            ((this.timeCount.finish - this.timeCount.start) / 1000) + ' сек\n');

        this.fillResults();
    }


    getLimitsMaxArray (arr) {
        return arr.map((obj) => obj.max);
    }


    checkInputData () {
        const app = this;
        let isOk = true;

        this.limits
            .forEach((dataItem) => {
                if (dataItem.coefs.length !== app.systemsNum) {
                    isOk = false;
                }
            });

        if (this.phi.length !== this.systemsNum) {
            isOk = false;
        }

        return isOk;
    }


    buildTableMainData1 (systemNum, limBounds) {
        const app = this;
        const data = [];

        if (systemNum === 0) {
            const dataItem = {};

            [dataItem['M'], dataItem['L']] = app.getML(limBounds, systemNum);

            data[limBounds[0]] = dataItem;

        } else {
            for (let i = 0; i <= limBounds[0]; i++) {
                const dataItem = {};
                const selection = [i];

                [dataItem['M'], dataItem['L']] = app.getML(selection, systemNum);

                data[i] = dataItem;
            }
        }

        this.tablesData[systemNum] = data;
    }


    buildTableMainData2 (systemNum, limBounds) {
        const app = this;
        const data = [];

        if (systemNum === 0) {
            const dataItem = {};

            [dataItem['M'], dataItem['L']] = app.getML(limBounds, systemNum);

            data[limBounds[0]] = [];
            data[limBounds[0]][limBounds[1]] = dataItem;

        } else {
            for (let i = 0; i <= limBounds[0]; i++) {
                data[i] = [];
                for (let j = 0; j <= limBounds[1]; j++) {
                    const dataItem = {};
                    const selection = [i, j];

                    [dataItem['M'], dataItem['L']] = app.getML(selection, systemNum);

                    data[i][j] = dataItem;
                }
            }
        }

        this.tablesData[systemNum] = data;
    }


    buildTableMainData3 (systemNum, limBounds) {
        const app = this;
        const data = [];

        if (systemNum === 0) {
            const dataItem = {};

            [dataItem['M'], dataItem['L']] = app.getML(limBounds, systemNum);

            data[limBounds[0]] = [];
            data[limBounds[0]][limBounds[1]] = [];
            data[limBounds[0]][limBounds[1]][limBounds[2]] = dataItem;

        } else {
            for (let i = 0; i <= limBounds[0]; i++) {
                data[i] = [];
                for (let j = 0; j <= limBounds[1]; j++) {
                    data[i][j] = [];
                    for (let k = 0; k <= limBounds[2]; k++) {
                        const dataItem = {};
                        const selection = [i, j, k];

                        [dataItem['M'], dataItem['L']] = app.getML(selection, systemNum);

                        data[i][j][k] = dataItem;
                    }
                }
            }
        }

        this.tablesData[systemNum] = data;
    }


    buildTableMainData4 (systemNum, limBounds) {
        const app = this;
        const data = [];

        if (systemNum === 0) {
            const dataItem = {};

            [dataItem['M'], dataItem['L']] = app.getML(limBounds, systemNum);

            data[limBounds[0]] = [];
            data[limBounds[0]][limBounds[1]] = [];
            data[limBounds[0]][limBounds[1]][limBounds[2]] = [];
            data[limBounds[0]][limBounds[1]][limBounds[2]][limBounds[3]] = dataItem;

        } else {
            for (let i = 0; i <= limBounds[0]; i++) {
                data[i] = [];
                for (let j = 0; j <= limBounds[1]; j++) {
                    data[i][j] = [];
                    for (let k = 0; k <= limBounds[2]; k++) {
                        data[i][j][k] = [];
                        for (let l = 0; l <= limBounds[3]; l++) {
                            const dataItem = {};
                            const selection = [i, j, k, l];

                            [dataItem['M'], dataItem['L']] = app.getML(selection, systemNum);

                            data[i][j][k][l] = dataItem;
                        }
                    }
                }
            }
        }

        this.tablesData[systemNum] = data;
    }


    /* Getting proper amount of reserve elements (M) and its functional value (L)
     *
     * @param selection - amount of reserve for every limit (selection.length - number of limits)
     * @param systemNum - which system (step) is running
     */
    getML (selection, systemNum) {
        const app = this;
        let M, L = 0;

        // if first (n) step
        if (systemNum === this.systemsNum - 1) {
            const divRes = selection.map((val, index) => val / app.limits[index].coefs[systemNum]);

            M = Math.floor(Math.min.apply(null, divRes));
            L = this.phi[systemNum][M];
        }

        // if n-1..2 or last (1) step
        else {
            const divRes = selection.map((val, index) => val / app.limits[index].coefs[systemNum]);

            const maxPossibleM = Math.floor(Math.min.apply(null, divRes));
            const possibleL = [];

            for (let m = 0; m <= maxPossibleM; m++) {
                let sArray = [];

                selection
                    .forEach((val, index) => sArray.push(val - app.limits[index].coefs[systemNum] * m));

                let intermediateL = this.phi[systemNum][m] +
                    this.getMLFromTable(systemNum + 1, sArray, 'L');

                possibleL.push(intermediateL);
            }

            L = Math.max.apply(null, possibleL);
            M = possibleL.indexOf(L);
        }

        return [M, L];
    }


    getMLFromTable (systemNum, sArray, paramToGet) {
        let data = this.tablesData[systemNum];

        for (let i = 0; i < sArray.length; i++) {
            data = data[sArray[i]];
        }

        return data[paramToGet];
    }


    getOptimalReserve () {
        const app = this;
        const optReserve = {
            amount: [],
            reliability: 0
        };

        for (let i = 0; i < this.systemsNum; i++) {
            const sArray = [];

            for (let s = 0; s < this.limitsNum; s++) {
                let sI = this.limits[s].max;

                for (let j = 0; j < i; j++) {
                    sI -= this.limits[s].coefs[j] * optReserve.amount[j];
                }

                sArray.push(sI);
            }

            let optM = this.getMLFromTable(i, sArray, 'M');

            optReserve.amount.push(optM);
        }

        optReserve.reliability = optReserve.amount
            .reduce((mult, current, i) => mult * app.probs[i][current], 1)
            .toFixed(7) * 1;

        return optReserve;
    }


    fillResults () {
        const rowsAmount = Math.max.apply(null, this.phi.map((item) => Object.keys(item).length));
        const showLogs = !!+localStorage.getItem('im-show-logs');
        let resAmountInner = '';
        let tableInner = '<tr><th>К-ть резерву</th>';

        for (let sys = 1; sys <= this.systemsNum; sys++) {
            resAmountInner += '<p>№' + sys + ': <span>' + this.optimalReserve.amount[sys - 1] + '</span></p>';
            tableInner += '<th>' +
                '<span class="js-prob' + (showLogs ? ' hidden' : '') + '">P' + sys + '</span>' +
                '<span class="js-log' + (showLogs ? '' : ' hidden') + '">Ln(P' + sys + ')</span>' +
                '</th>';
        }
        tableInner += '</tr>';
        for (let row = 0; row < rowsAmount; row++) {
            tableInner += '<tr><td>' + row + '</td>';
            for (let sys = 0; sys < this.systemsNum; sys++) {
                tableInner += '<td class="' + (this.probs[sys][row] ? '' : 'undef') + '">' +
                    '<span class="js-prob' + (showLogs ? ' hidden' : '') + '">' + (this.probs[sys][row] || '1') + '</span>' +
                    '<span class="js-log' + (showLogs ? '' : ' hidden') + '">' + (this.phi[sys][row] || '0') + '</span>' +
                    '</td>';
            }
            tableInner += '</tr>';
        }

        document.getElementsByClassName('js-sub-sys-res')[0].innerHTML = resAmountInner;
        document.getElementsByClassName('js-sys-rel')[0].innerHTML = this.optimalReserve.reliability.toString();
        document.getElementsByClassName('js-sub-sys-rel')[0].innerHTML = tableInner;

        window.inFace.toggleLoaderVisibility();
        window.inFace.toggleSections(window.inFace);
    }
}

export {DynamicProgramming};