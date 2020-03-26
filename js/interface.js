class Interface  {
    constructor () {
        this.minSysAmount = 1;
        this.maxSysAmount = 10;
        this.minLimAmount = 1;
        this.maxLimAmount = 4;

        this.inputValues = JSON.parse(localStorage.getItem('im-input-val')) || {};

        this.systemsNum = document.querySelectorAll('.sys_item:not(.hidden)').length;
        this.limitsNum = document.querySelectorAll('.lim_item:not(.hidden)').length;

        this.trigger = {
            sysDecrease: document.getElementById('sys-decrease'),
            sysIncrease: document.getElementById('sys-increase'),
            limDecrease: document.getElementById('lim-decrease'),
            limIncrease: document.getElementById('lim-increase'),
            appRun: document.getElementById('app-run'),
            toggleSections: document.getElementById('toggle-sections')
        };
        this.inputsAll = document.querySelectorAll('.im_main input:not([type="checkbox"])');
        this.sections = document.querySelectorAll('.js-section');
        this.showLogsCheckbox = document.getElementById('show-logs');
    }


    init () {
        const $this = this;

        this.setInputValuesFromStorage();

        this.trigger.sysDecrease.addEventListener('click', () => $this.decreaseSystemsAmount($this));
        this.trigger.sysIncrease.addEventListener('click', () => $this.increaseSystemsAmount($this));
        this.trigger.limDecrease.addEventListener('click', () => $this.decreaseLimitsAmount($this));
        this.trigger.limIncrease.addEventListener('click', () => $this.increaseLimitsAmount($this));
        this.trigger.appRun.addEventListener('click', () => $this.runApp($this));
        this.inputsAll
            .forEach((input) => {
                input.addEventListener('input', () => {
                    $this.validateInputOnlyInteger(input);
                    $this.pushInputValueToStorage(input);
                });
                $this.pushInputValueToStorage(input);
            });
        this.trigger.toggleSections.addEventListener('click', () => $this.toggleSections($this));
        this.showLogsCheckbox.addEventListener('change', $this.toggleLogs);

        this.showLogsCheckbox.checked = !!(+localStorage.getItem('im-show-logs'));
    }


    decreaseSystemsAmount ($this) {
        if ($this.systemsNum === $this.minSysAmount) return;

        document.querySelector('.sys_item[data-sys="' + $this.systemsNum + '"]').classList.add('hidden');
        document.querySelectorAll('.lim_item [data-sys="' + $this.systemsNum + '"]')
            .forEach((item) => item.classList.add('hidden'));
        document.getElementsByClassName('js-sys-val')[0].innerHTML = (--$this.systemsNum).toString();

        $this.toggleBtnAccess();
    }


    increaseSystemsAmount ($this) {
        if ($this.systemsNum === $this.maxSysAmount) return;

        document.querySelector('.sys_item[data-sys="' + (++$this.systemsNum) + '"]').classList.remove('hidden');
        document.querySelectorAll('.lim_item [data-sys="' + $this.systemsNum + '"]')
            .forEach((item) => item.classList.remove('hidden'));
        document.getElementsByClassName('js-sys-val')[0].innerHTML = $this.systemsNum.toString();

        $this.toggleBtnAccess();
    }


    decreaseLimitsAmount ($this) {
        if ($this.limitsNum === $this.minLimAmount) return;

        document.querySelector('.lim_item[data-lim="' + $this.limitsNum + '"]').classList.add('hidden');
        document.getElementsByClassName('js-lim-val')[0].innerHTML = (--$this.limitsNum).toString();

        $this.toggleBtnAccess();
    }


    increaseLimitsAmount ($this) {
        if ($this.limitsNum === $this.maxLimAmount) return;

        document.querySelector('.lim_item[data-lim="' + (++$this.limitsNum) + '"]').classList.remove('hidden');
        document.getElementsByClassName('js-lim-val')[0].innerHTML = $this.limitsNum.toString();

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


    validateInputOnlyInteger (input) {
        let editedValue = input.value.replace(/[^0-9]/g, '');
        if (editedValue.length > 1 && editedValue[0] === '0') {
            editedValue = editedValue.substring(1, editedValue.length);
        }
        input.value = editedValue;

        if (editedValue.length && editedValue[0] !== '0') {
            input.classList.remove('error');
        }
    }


    checkIfInputsNotEmpty () {
        let errCount = 0;

        this.inputsAll
            .forEach((input) => {
                if (input.offsetParent !== null && (!input.value.length || parseInt(input.value) === 0)) {
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
        data.mu = this.inputValues['recovery-intensity'];

        return data;
    }


    runApp ($this) {
        if ($this.checkIfInputsNotEmpty()) {
            $this.toggleLoaderVisibility();

            setTimeout(() => {
                const modeling = new ImitationModeling($this.setDataForModeling());
                modeling.run();
            }, 100);
        }
    }
}


const inFace = new Interface();
inFace.init();