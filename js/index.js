const signInBtn = document.querySelector(".signIn-btn")
const hints = document.querySelector(".hints")
//登入
signInBtn.addEventListener("click", signIn)
function signIn() {
    if (email.value.trim() === "") {
        hints.textContent = "此欄位不得為空"
        return
    }
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
                title: "登入成功",
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

