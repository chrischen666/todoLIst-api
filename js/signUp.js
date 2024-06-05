const signUpBtn = document.querySelector(".signUp-btn")

//註冊
signUpBtn.addEventListener("click", signUp)
function signUp() {
    if (email.value.trim() === "" || nickname.value.trim() === "" || pwd.value.trim() === "" || pwdCheck.value.trim() === "") {
        Swal.fire({
            title: "不得為空",
            icon: "warning",
        });

    }
    else if (pwd.value.length < 6) {
        Swal.fire({
            title: "密碼少於6位數",
            icon: "warning",    
        });
    }
    else {
        if (pwd.value !== pwdCheck.value) {
            Swal.fire({
                title: "密碼不相符",
                icon: "warning",
            });
        }
        else {
            let message
            axios.post(`${url}`, {
                "user": {
                    "email": email.value,
                    "nickname": nickname.value,
                    "password": pwd.value
                }
            })
                .then(suc => {
                    signIn()
                    console.log(suc)
                })
                .catch(Error => {
                    if (Error.response) {
                        console.log(Error.response.data.error)
                        message = Error.response.data.error
                    }
                    else {
                        console.log(Error)
                    }
                    Swal.fire({
                        title: message,
                        icon: "error",
                    });
                })
        }
    }
}

//登入
function signIn() {
    axios.post(`${url}/sign_in`,
        {
            "user": {
                "email": email.value,
                "password": pwd.value
            }
        }
    )
        .then(suc => {
            localStorage.removeItem("showName")
            localStorage.removeItem("token")
            localStorage.setItem("showName", suc.data.nickname)
            localStorage.setItem("token", suc.headers.authorization)
            Swal.fire({
                title: "註冊成功",
                icon: "success",
            }).then(() => {
                todo()
            });
        })
        .catch(Error => {
            if (Error.response) {
                console.log(Error.response)
            }   
            else {
                console.log(Error)
            }
            Swal.fire({
                title: "登入失敗",
                icon: "error",
            });
        }
        )
}

