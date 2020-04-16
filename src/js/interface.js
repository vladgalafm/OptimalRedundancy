import {ImitationModeling} from "./imitationModeling";

class Interface  {
    constructor () {
        this.minSysAmount = 1;
        this.maxSysAmount = 15;
        this.minLimAmount = 1;
        this.maxLimAmount = 4;
        this.inputValues = JSON.parse(localStorage.getItem('im-input-val')) || {};

        this.systemsNum = document.querySelectorAll('.sys_item:not(.hidden)').length;
        this.limitsNum = document.querySelectorAll('.lim_item:not(.hidden)').length;
        this.systemsNumToSet = JSON.parse(localStorage.getItem('im-sys-num')) || this.systemsNum;
        this.limitsNumToSet = JSON.parse(localStorage.getItem('im-lim-num')) || this.limitsNum;

        this.trigger = {
            sysDecrease: document.getElementById('sys-decrease'),
            sysIncrease: document.getElementById('sys-increase'),
            limDecrease: document.getElementById('lim-decrease'),
            appRun: document.getElementById('app-run'),
            limIncrease: document.getElementById('lim-increase'),
            toggleSections: document.getElementById('toggle-sections'),
            allowRecovery: document.getElementById('allow-recovery'),
            projectInfo: document.getElementsByClassName('js-project-info')[0]
        };
        this.alertPopup = document.getElementById('data-limit-alert');
        this.appRunModalBtn = document.getElementsByClassName('js-run-app')[0];
        this.closePopupBtn = document.querySelectorAll('.js-close-popup');
        this.inputsAll = document.querySelectorAll('.im_main input:not([type="checkbox"]), .im_main select');
        this.sections = document.querySelectorAll('.js-section');
        this.showLogsCheckbox = document.getElementById('show-logs');

        this.recoveryAllowed = true;
    }


    init () {
        const $this = this;

        this.setInputValuesFromStorage();
        this.setSysAndLimNumFromStorage();

        this.trigger.sysDecrease.addEventListener('click', () => $this.decreaseSystemsAmount($this));
        this.trigger.sysIncrease.addEventListener('click', () => $this.increaseSystemsAmount($this));
        this.trigger.limDecrease.addEventListener('click', () => $this.decreaseLimitsAmount($this));
        this.trigger.limIncrease.addEventListener('click', () => $this.increaseLimitsAmount($this));
        this.trigger.appRun.addEventListener('click', () => $this.runAppHelper($this));
        this.appRunModalBtn.addEventListener('click', () => $this.runApp($this, $this.setDataForModeling()));
        this.closePopupBtn
            .forEach((btn) => {
                btn.addEventListener('click', () => $this.closeAlertPopup($this));
            });
        this.inputsAll
            .forEach((input) => {
                input.addEventListener('input', () => {
                    $this.validateInputValue(input);
                    $this.pushInputValueToStorage(input);
                });
                $this.pushInputValueToStorage(input);
            });
        this.trigger.toggleSections.addEventListener('click', () => $this.toggleSections($this));
        this.trigger.allowRecovery.addEventListener('click', () => $this.toggleRecovery($this, this.trigger.allowRecovery));
        this.showLogsCheckbox.addEventListener('change', $this.toggleLogs);
        this.trigger.projectInfo.addEventListener('click', (e) => $this.toggleProjectInfo(e, $this));

        this.showLogsCheckbox.checked = !!(+localStorage.getItem('im-show-logs'));
    }


    decreaseSystemsAmount ($this) {
        if ($this.systemsNum === $this.minSysAmount) return;

        document.querySelector('.sys_item[data-sys="' + $this.systemsNum + '"]').classList.add('hidden');
        document.querySelectorAll('.lim_item [data-sys="' + $this.systemsNum + '"]')
            .forEach((item) => item.classList.add('hidden'));
        document.getElementsByClassName('js-sys-val')[0].innerHTML = (--$this.systemsNum).toString();

        localStorage.setItem('im-sys-num', JSON.stringify($this.systemsNum));
        $this.toggleBtnAccess();
    }


    increaseSystemsAmount ($this) {
        if ($this.systemsNum === $this.maxSysAmount) return;

        document.querySelector('.sys_item[data-sys="' + (++$this.systemsNum) + '"]').classList.remove('hidden');
        document.querySelectorAll('.lim_item [data-sys="' + $this.systemsNum + '"]')
            .forEach((item) => item.classList.remove('hidden'));
        document.getElementsByClassName('js-sys-val')[0].innerHTML = $this.systemsNum.toString();

        localStorage.setItem('im-sys-num', JSON.stringify($this.systemsNum));
        $this.toggleBtnAccess();
    }


    decreaseLimitsAmount ($this) {
        if ($this.limitsNum === $this.minLimAmount) return;

        document.querySelector('.lim_item[data-lim="' + $this.limitsNum + '"]').classList.add('hidden');
        document.getElementsByClassName('js-lim-val')[0].innerHTML = (--$this.limitsNum).toString();

        localStorage.setItem('im-lim-num', JSON.stringify($this.limitsNum));
        $this.toggleBtnAccess();
    }


    increaseLimitsAmount ($this) {
        if ($this.limitsNum === $this.maxLimAmount) return;

        document.querySelector('.lim_item[data-lim="' + (++$this.limitsNum) + '"]').classList.remove('hidden');
        document.getElementsByClassName('js-lim-val')[0].innerHTML = $this.limitsNum.toString();

        localStorage.setItem('im-lim-num', JSON.stringify($this.limitsNum));
        $this.toggleBtnAccess();
    }


    toggleBtnAccess () {
        this.trigger.sysDecrease.disabled = this.systemsNum === this.minSysAmount;
        this.trigger.sysIncrease.disabled = this.systemsNum === this.maxSysAmount;
        this.trigger.limDecrease.disabled = this.limitsNum === this.minLimAmount;
        this.trigger.limIncrease.disabled = this.limitsNum === this.maxLimAmount;
    }


    pushInputValueToStorage (input) {
        this.inputValues[input.getAttribute('id')] = input.value;
        localStorage.setItem('im-input-val', JSON.stringify(this.inputValues));
    }


    setInputValuesFromStorage () {
        for (let id in this.inputValues) {
            document.getElementById(id).value = this.inputValues[id];
        }
    }


    setSysAndLimNumFromStorage () {
        let systemNumDiff = this.systemsNumToSet - this.systemsNum;
        let limitsNumDiff = this.limitsNumToSet - this.limitsNum;

        if (systemNumDiff > 0) {
            for (systemNumDiff; systemNumDiff > 0; systemNumDiff--) {
                this.increaseSystemsAmount(this);
            }
        } else if (systemNumDiff < 0) {
            for (systemNumDiff; systemNumDiff < 0; systemNumDiff++) {
                this.decreaseSystemsAmount(this);
            }
        }

        if (limitsNumDiff > 0) {
            for (limitsNumDiff; limitsNumDiff > 0; limitsNumDiff--) {
                this.increaseLimitsAmount(this);
            }
        } else if (limitsNumDiff < 0) {
            for (limitsNumDiff; limitsNumDiff < 0; limitsNumDiff++) {
                this.decreaseLimitsAmount(this);
            }
        }
    }


    validateInputValue (input) {
        let editedValue = (input.classList.contains('float')) ? input.value.replace(/[^0-9.]/g, '')
            : input.value.replace(/[^0-9]/g, '');

        if (editedValue.length > 1 && editedValue[0] === '0' && editedValue[1] !== '.') {
            editedValue = editedValue.substring(1, editedValue.length);
        }

        input.value = editedValue;

        if (editedValue.length && parseFloat(editedValue) !== 0) {
            input.classList.remove('error');
        }
    }


    checkIfInputsNotEmpty () {
        let errCount = 0;

        this.inputsAll
            .forEach((input) => {
                if (input.offsetParent !== null && !input.getAttribute('disabled') &&
                    (!input.value.length || parseFloat(input.value) === 0)) {
                    input.classList.add('error');
                    errCount++;
                } else {
                    input.classList.remove('error');
                }
            });

        return !errCount;
    }


    toggleLoaderVisibility () {
        document.getElementById('processing').classList.toggle('hidden');
    }


    toggleSections ($this) {
        $this.trigger.toggleSections.classList.toggle('close');
        $this.trigger.toggleSections.classList.remove('hidden');
        $this.sections
            .forEach((section) => section.classList.toggle('hidden'));
    }


    toggleRecovery ($this, checkbox) {
        const recIndex = document.getElementById('recovery-intensity');

        (checkbox.checked) ? recIndex.removeAttribute('disabled')
            : recIndex.setAttribute('disabled', 'true');
        $this.recoveryAllowed = checkbox.checked;
    }


    toggleLogs () {
        const checkbox = this;
        document.querySelectorAll('.js-prob')
            .forEach((item) => {
                (checkbox.checked) ? item.classList.add('hidden') : item.classList.remove('hidden');
            });
        document.querySelectorAll('.js-log')
            .forEach((item) => {
                (checkbox.checked) ? item.classList.remove('hidden') : item.classList.add('hidden');
            });
        localStorage.setItem('im-show-logs', (this.checked ? '1' : '0'));
    }


    checkOperationsLimit (data) {
        const systemsNum = data.lambda.length;
        const dynProgCombNum = data.limits
            .map((item) => item.max)
            .reduce((mult, current, i) => mult * current, 1);

        if ((systemsNum - 1) * dynProgCombNum > 25000000) {
            this.openAlertPopup(this);
            return false;
        }

        return true;
    }


    openAlertPopup ($this) {
        $this.alertPopup.classList.remove('hidden');
    }


    closeAlertPopup ($this) {
        $this.alertPopup.classList.add('hidden');
    }


    toggleProjectInfo (event, $this) {
        if (event.target.classList.contains('js-info-description')) return;

        $this.trigger.projectInfo.classList.toggle('active');
    }


    setDataForModeling () {
        const data = {
            lambda: [],
            limits: []
        };

        for (let i = 1; i <= this.systemsNum; i++) {
            data.lambda.push(this.inputValues['sys' + i]);
        }
        for (let i = 1; i <= this.limitsNum; i++) {
            let limitData = {};
            limitData.max = this.inputValues['lim' + i + 'max'] * 1;
            limitData.coefs = [];
            for (let j = 1; j <= this.systemsNum; j++) {
                limitData.coefs.push(this.inputValues['lim' + i + 'sys' + j] * 1);
            }
            data.limits.push(limitData);
        }

        data.time = this.inputValues['time'];
        data.iterations = this.inputValues['iteration-amount'];
        data.mu = (this.recoveryAllowed) ? this.inputValues['recovery-intensity'] : false;

        return data;
    }


    runAppHelper ($this) {
        if ($this.checkIfInputsNotEmpty()) {
            const dataForModeling = $this.setDataForModeling();

            if (!$this.checkOperationsLimit(dataForModeling)) return;

            $this.runApp($this, dataForModeling);
        }
    }


    runApp ($this, dataForModeling) {
        $this.toggleLoaderVisibility();

        setTimeout(() => {
            const modeling = new ImitationModeling(dataForModeling);
            modeling.run();
        }, 100);
    }
}


window.inFace = new Interface();
inFace.init();