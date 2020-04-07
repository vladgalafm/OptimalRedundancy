import {DynamicProgramming} from "./dynamicProgramming";

class ImitationModeling {
    constructor (data) {
        for (let key in data) {
            this[key] = data[key];
        }
        this.probs = [];
    }


    run () {
        const timeStart = new Date;
        for (let sys = 0; sys < this.lambda.length; sys++) {
            let maxReserve = this.getReserveMaxAmount(sys);

            this.probs.push({});

            // v1.01 - maxReserve always should be !== Infinity
            if (maxReserve === Infinity) {
                let res = 0;
                let prob = 0;

                while (prob < 1) {
                    prob = this.getSuccessProbability(sys, res);
                    this.probs[sys][res++] = prob;
                }
            } else {
                for (let res = 0; res <= maxReserve; res++) {
                    this.probs[sys][res] = (this.probs[sys][res - 1] === 1 && this.iterations >= 100000) ?
                        1 : this.getSuccessProbability(sys, res);
                }
            }
        }
        const timeEnd = new Date();
        console.log('Час роботи імітаційного моделювання: ' + ((timeEnd - timeStart) / 1000) + ' сек\n');

        this.phi = this.convertProbValues(this.probs);

        this.findSolution();
    }


    getReserveMaxAmount (sysNum) {
        const maxRes = [];

        for (let i = 0; i < this.limits.length; i++) {
            maxRes.push(Math.floor(this.limits[i].max / this.limits[i].coefs[sysNum]));
        }

        return Math.min.apply(null, maxRes);
    }


    getSuccessProbability (sysNum, resAmount) {
        let successCount = 0;

        for (let i = 0; i < this.iterations; i++) {
            successCount += this.simulateSystem(sysNum, resAmount);
        }

        return successCount / this.iterations;
    }


    simulateSystem (sysNum, resAmount) {
        const coef = 1000000;
        let mainEl = [this.convertNum(this.getWorkTime(this.lambda[sysNum]), coef)];
        let subEls = [];
        let renewalEls = [];
        let timeLeft = this.convertNum(this.time, coef);

        for (let i = 0; i < resAmount; i++) {
            subEls.push(Infinity);
        }

        while (timeLeft > 0) {
            let timeUnits = mainEl.concat(subEls, renewalEls, timeLeft);
            let timeStep = Math.min.apply(null, timeUnits);

            mainEl = mainEl.map((item) => item - timeStep);
            subEls = subEls.map((item) => item - timeStep);
            renewalEls = renewalEls.map((item) => item - timeStep);

            if (mainEl[0] === 0) {
                if (!subEls.length) {
                    return 0;
                } else {
                    renewalEls.push(this.convertNum(this.getRepairTime(this.mu), coef));
                    subEls.splice(0, 1);
                    mainEl[0] = this.convertNum(this.getWorkTime(this.lambda[sysNum]), coef);
                }
            } else if (renewalEls.indexOf(0) > -1) {
                renewalEls.splice(renewalEls.indexOf(0), 1);
                subEls.push(Infinity);
            }

            timeLeft -= timeStep;
        }

        return 1;
    }


    getWorkTime (lambda) {
        return -1 / lambda * Math.log(Math.random());
    }


    getRepairTime (mu) {
        return (mu) ? -1 / mu * Math.log(Math.random()) : this.time;
    }


    convertNum (val, coef) {
        return parseInt(val * coef);
    }


    convertProbValues (probs) {
        return probs.map(function (obj) {
            let newObj = {};

            for (let index in obj) {
                newObj[index] = Math.log(obj[index]).toFixed(9) * 1;
            }

            return newObj;
        });
    }


    setDataForSolution () {
        const data = {};

        data.limits = this.limits;
        data.probs = this.probs;
        data.phi = this.phi;

        return data;
    }


    findSolution () {
        const solutionAlgorithm = new DynamicProgramming(this.setDataForSolution());
        solutionAlgorithm.init();
    }
}

export {ImitationModeling};