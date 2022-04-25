
function Validator(options) {

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage;

        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule & kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value)
            console.log(errorMessage)
            if (errorMessage) break;
        }
                    
        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerHTML = "";
            inputElement.parentElement.classList.remove('invalid')

        }

        return !errorMessage
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if (formElement) {

        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var isFormValid = true;

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
                validate(inputElement, rule)
            });

            var enableInputs = formElement.querySelectorAll('[name]')
            var formValues = Array.from(enableInputs).reduce(function (values, input) {
                return (values[input.name] = input.value) && values;
            }, {});

            console.log(formValues)

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {

                    options.onSubmit({
                        name: 'Quang Hiep'
                    });
                }
            }

        }

        // Lặp qua từng rule và xử lý
        options.rules.forEach(function (rule) {
            console.log(rule)

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            if (inputElement) {
                
                // Xử lý trường hợp blur
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                // Xử lý trường hợp mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }

}
// Định nghĩa Rules
// 1. Khi có lỗi thì trả về message lỗi
// 2. Khi không có lỗi thì không trả ra gì cả (underfined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'こちらに入力してください'
        }
    };
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'メールアドレスが正しくありません';
        }
    };
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `${min} 桁以上を入力してください`;
        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "入力データが正しくありません"
        }
    }
}