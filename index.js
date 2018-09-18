var isValid = true;
var errorFields = [];
var myForm = {
    validate:function() {
        let resend = { isValid: isValid, errorFields: errorFields }
        return resend;
    },
    getData:function() {
        let $form = $('form')[0];
        let objForm = {}
        for(let i = 0;i<$form.length;i++){
            objForm[$form[i].name]=$form[i].value;
        }
        return objForm;
    },
    setData:function(objForm) {
        let $form = $('form')[0];
           $form[0].value =  objForm['fio'];
           $form[1].value =  objForm['email'];
           $form[2].value =  objForm['phone'];
        return
    },
    submit:function(){

        function phoneError() {
            $("input[name = 'phone']").addClass('error');
            isValid = false;
            errorFields[errorFields.length] = 'phone';
        }
        function phoneValidation(Phone) {
            //validate Phone
            if ((Phone[0] != '+') || (Phone[1] != '7')) {
                phoneError();
                return
            }
            if ((Phone[2] != '(') || (Phone[6] != ')')) {
                phoneError();
                return
            }
            if ((Phone[10] != '-') || (Phone[13] != '-')) {
                phoneError();
                return
            }
            if (Phone.length > 16) {
                phoneError();
                return
            }
            var sum = 0;
            for (var i = 0; i <= 16; i++) {
                sum += +Phone[i] || 0;
            }
            if (sum > 30) {
                phoneError();
                return
            }
            $("input[name = 'phone']").removeClass('error');
            return
        }
        function emailValidation(Email) {
            //validate Email
            if ((Email[1] != 'yandex.ru') && (Email[1] != 'google.com') && (Email[1] != 'mail.ru')) {
                //error
                errorFields[errorFields.length] = 'email';
                $("input[name = 'email']").addClass('error');
                isValid = false;
            }
            else {
                $("input[name = 'email']").removeClass('error')
            }
            return
        }
        function messageValidation(Message) {
            //validate message
            if (Message) {
                $("textarea[name = 'message']").removeClass('error')
            }
            else {
                errorFields[errorFields.length] = 'message';
                $("textarea[name = 'message']").addClass('error');
                isValid = false;
            }
            return
        }
        function nameValidation(Name) {
            //validate Name

            if ((Name.length < 3) || (Name.length > 3)) {
                errorFields[errorFields.length] = 'FIO';
                $("input[name = 'fio']").addClass('error');
                isValid = false;
            }
            else {
                $("input[name = 'fio']").removeClass('error')
            }
        }
        function request($form) {
            $.ajax({
                //  type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize()
            }).done(function (data) {
                data = JSON.parse(data);
                console.log('success');
                if (data['status'] == 'success') {
                    $("#resultContainer").addClass('success');
                    $("#resultContainer").text('Success');
                }
                if (data['status'] == 'error') {
                    $("#resultContainer").addClass('success');
                    $("#resultContainer").text(data['reason']);
                }
                if (data['status'] == 'progress') {
                    console.log('progress');
                    setTimeout(request, data['timeout'], $form);
                }
            }).fail(function () {
                console.log('fail');
            });
        }
        $('form').submit(function (e) {
            isValid = true;
            errorFields = [];
            var $form = $(this);
            nameValidation($form.serializeArray()[0].value.split(' '));
            emailValidation($form.serializeArray()[1].value.split('@'));
            phoneValidation($form.serializeArray()[2].value);
            messageValidation($form.serializeArray()[3].value);
            // myForm.validate();
            // myForm.getData();
            // myForm.setData();
            if (isValid == true) {
                console.log("succsess send");
                $('input').removeClass('error')
                $('textarea').removeClass('error')
                $("#submitButton").prop("disabled", true);
                request($form);
            }
            else {
                console.log("error send");
            }
            e.preventDefault();
        });

    }
}
myForm.submit();
