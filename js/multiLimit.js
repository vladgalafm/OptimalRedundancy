const MultiLimit = function () {
    this.limits = [
        {
            max: 12,
            coefs: [3, 2, 1]
        },
        {
            max: 40,
            coefs: [12, 8, 4]
        },
        // {
        //     max: 60,
        //     coefs: [15, 12, 10]
        // },
        // {
        //     max: 100,
        //     coefs: [30, 15, 10]
        // },
    ];
    this.phi = [
        {
            0: -0.999221355,
            1: -0.240570777,
            2: -0.048594833,
            3: -0.007781195,
            4: -0.000975475,
            // 5: 0,
            // 6: 0,
            // 7: 0,
            // 8: 0,
            // 9: 0,
            // 10: 0,
            // 11: 0,
            // 12: 0
        },
        {
            0: -1.999595776,
            1: -0.725253103,
            2: -0.245560442,
            3: -0.072127780,
            4: -0.018269882,
            5: -0.003777124,
            6: -0.000752282,
            // 7: 0,
            // 8: 0,
            // 9: 0,
            // 10: 0,
            // 11: 0,
            // 12: 0
        },
        {
            0: -4.988189105,
            1: -2.686117491,
            2: -1.468207483,
            3: -0.776496181,
            4: -0.387517140,
            5: -0.178869521,
            6: -0.075321785,
            7: -0.028710222,
            8: -0.010071548,
            9: -0.003130896,
            10: -0.000907411,
            11: -0.000221024,
            12: -0.000046001
        }
    ];
    this.tablesData = [];
    this.optimalReserve = [];

    // Time passed counting
    this.timeCount = {
        start: 0,
        finish: 0
    };
};


MultiLimit.prototype.init = function () {
    this.timeCount.start = new Date();

    this.limitsNum = this.limits.length;
    this.systemsNum = this.limits[0].coefs.length;

    if (this.checkInputData()) {
        this.run();
    } else {
        console.log('Something wrong with input data, check it and try again');
    }
};


MultiLimit.prototype.run = function () {
    this.limitsBounds = this.getLimitsMaxArray(this.limits);

    for (let i = this.systemsNum - 1; i >= 0; i--) {
        this['buildTableMainData' + this.limitsNum](i, this.limitsBounds);
    }

    this.optimalReserve = this.getOptimalAmountOfReserve(this.tablesData);

    this.timeCount.finish = new Date();

    this.printResults();
};


MultiLimit.prototype.getLimitsMaxArray = function (arr) {
    return arr.map(function (obj) {
        return obj.max;
    });
};


MultiLimit.prototype.checkInputData = function () {
    const app = this;
    let isOk = true;

    this.limits.forEach(function (dataItem) {
        if (dataItem.coefs.length !== app.systemsNum) {
            isOk = false;
        }
    });

    if (this.phi.length !== this.systemsNum) {
        isOk = false;
    }

    return isOk;
};


MultiLimit.prototype.buildTableMainData1 = function (systemNum, limBounds) {
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
};


MultiLimit.prototype.buildTableMainData2 = function (systemNum, limBounds) {
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
};


MultiLimit.prototype.buildTableMainData4 = function (systemNum, limBounds) {
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
};


MultiLimit.prototype.buildTableMainData3 = function (systemNum, limBounds) {
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
};


/* Getting proper amount of reserve elements (M) and its functional value (L)
 *
 * @param selection - amount of reserve for every limit (selection.length - number of limits)
 * @param systemNum - which system (step) is running
 */
MultiLimit.prototype.getML = function (selection, systemNum) {
    const app = this;
    let M, L = 0;

    // if first (n) step
    if (systemNum === this.systemsNum - 1) {
        const divRes = selection.map(function (val, index) {
            return val / app.limits[index].coefs[systemNum];
        });

        M = Math.floor(Math.min.apply(null, divRes));
        L = this.phi[systemNum][M];
    }

    // if n-1..2 or last (1) step
    else {
        const divRes = selection.map(function (val, index) {
            return val / app.limits[index].coefs[systemNum];
        });

        const maxPossibleM = Math.floor(Math.min.apply(null, divRes));
        const possibleL = [];

        for (let m = 0; m <= maxPossibleM; m++) {
            let sArray = [];

            selection.forEach(function (val, index) {
                sArray.push(val - app.limits[index].coefs[systemNum] * m);
            });

            let intermediateL = this.phi[systemNum][m] +
                this.getMLFromTable(systemNum + 1, sArray, 'L');

            possibleL.push(intermediateL);
        }

        L = Math.max.apply(null, possibleL);
        M = possibleL.indexOf(L);
    }

    return [M, L];
};


MultiLimit.prototype.getMLFromTable = function (systemNum, sArray, paramToGet) {
    let data = this.tablesData[systemNum];

    for (let i = 0; i < sArray.length; i++) {
        data = data[sArray[i]];
    }

    return data[paramToGet];
};


MultiLimit.prototype.getOptimalAmountOfReserve = function (data) {
    const optReserve = [];

    for (let i = 0; i < this.systemsNum; i++) {
        const sArray = [];

        for (let s = 0; s < this.limitsNum; s++) {
            let sI = this.limits[s].max;

            for (let j = 0; j < i; j++) {
                sI -= this.limits[s].coefs[j] * optReserve[j];
            }

            sArray.push(sI);
        }

        let optM = this.getMLFromTable(i, sArray, 'M');

        optReserve.push(optM);
    }

    return optReserve;
};


MultiLimit.prototype.printResults = function () {
    let print = '';

    print += 'Время работы алгоритма: ' + ((this.timeCount.finish - this.timeCount.start) / 1000) + ' сек\n';
    print += '\nОграничения:\n';

    for (let i = 0; i < this.limitsNum; i++) {
        for( let j = 0; j < this.systemsNum; j++) {
            print += this.limits[i].coefs[j] + '*x' + (j + 1) +
                ((j !== this.systemsNum - 1) ? ' + ' : '');
        }
        print += ' <= ' + this.limits[i].max + '\n';
    }

    print += '\nОптимальный резерв подсистем:\n';

    this.optimalReserve.forEach(function (val, index) {
        print += '№' + (index + 1) + ': ' + val + '\n';
    });

    print += '\nТабличные данные:';

    console.log(print);
    console.log(this.tablesData);
};


const application = new MultiLimit();
application.init();