var url = "http://localhost:5000"
// var url = "https://twitter-jahan.herokuapp.com"
//user signup request using axios
function signup() {
    axios({
        method: 'post',
        url: url+'/signup',
        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false
}

//user login request using axios
function login() {
    axios({
        method: 'post',
        url: url+'/login',
        data: {
            email: document.getElementById('lemail').value,
            password: document.getElementById('lpassword').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./profile.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

//get profile request using axios
function getProfile() {
    axios({
        method: 'get',
        url: url+'/profile',
        credentials: 'include',
    }).then((response) => {
        document.getElementById('pName').innerHTML = response.data.profile.name
    }, (error) => {
        location.href = "./login.html"
    });
    return false
}

//user tweet or post request using axios
function post() {
    axios({
        method: 'post',
        url: url+'/tweet',
        credentials: 'include',
        data: {
            userName: document.getElementById('pName').innerHTML,
            tweet: document.getElementById('tweet').value,
        },
    }).then((response) => {
        console.log(response.data.data.message);
    }, (error) => {
        console.log(error.message);
    });
    document.getElementById('tweet').value = "";
    return false
}

//get all user post or tweet request using axios
function getTweets() {
    axios({
        method: 'get',
        url: url+'/getTweets',
        credentials: 'include',
    }).then((response) => {
        let tweets = response.data;
        let html = ""
        tweets.forEach(element => {
            html += `
            <div class="posts">
            <h4>${element.name}</h4>
            <p class="text-primary">${new Date(element.createdOn).toLocaleTimeString()}</p>
            <p class="noteCard">${element.tweets}</p>
            </div>
            `
        });
        document.getElementById('posts').innerHTML = html;

        let userTweet = response.data
        let userHtml = ""
        let userName = document.getElementById('pName').innerHTML;
        userTweet.forEach(element => {
            if (element.name == userName) {
                userHtml += `
                <div class="posts">
                <h4>${element.name}</h4>
                <p class="text-primary">${new Date(element.createdOn).toLocaleTimeString()}</p>
                <p class="noteCard">${element.tweets}</p>
                </div>
                `
            }
        });
        document.getElementById('userPosts').innerHTML = userHtml;
    }, (error) => {
        console.log(error.message);
    });
    return false
}

function getUsers() {
    axios({
        method: 'get',
        url: url+'/getUsers',
        credentials: 'include',
    }).then((response) => {
        let users = response.data;
        let usersHtml = ""
        users.forEach(element => {
            usersHtml += `
            <div class="posts">
            <h4>${element.name}</h4>
            <p>${element.phone}</p>
            <p class="noteCard">${element.email}</p>
            </div>
            `
        });
        document.getElementById('users').innerHTML = usersHtml;

    }, (error) => {
        console.log(error.message);
    });
    return false
}
// var url = 'http://localhost:5000';
var socket = io(url);
socket.on('NEW_POST', (newPost) => {
    console.log(newPost)
    let tweets = newPost.data;
    let html = ""
    tweets.forEach(element => {
        html += `
            <div class="posts">
            <h4>${element.name}</h4>
            <p>${element.tweets}</p>
            </div>
            `
    });
    document.getElementById('posts').innerHTML = html
})

//forget password request step1 using axios
function forgetPassword() {
    let email = document.getElementById('fEmail').value;
    localStorage.setItem('email', email)
    axios({
        method: 'post',
        url: url+'/forget-password',
        data: {
            email: email,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./forget2.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

//forget password request step2 using axios
function forgetPassword2() {
    let getEmail = localStorage.getItem('email')
    axios({
        method: 'post',
        url: url+'/forget-password-2',
        data: {
            email: getEmail,
            newPassword: document.getElementById('newPassword').value,
            otp: document.getElementById('otp').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

//profile logout request using axios
function logout() {
    axios({
        method: 'post',
        url: url+'/logout',
    }).then((response) => {
        location.href = "./login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}

//display homepage using display none or block property
document.getElementById('profile').style.display = "none"
document.getElementById('usersSection').style.display = "none"
function showHome() {
    document.getElementById('profile').style.display = "none"
    document.getElementById('home').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}

//display profile page using display none or block property
function showProfile() {
    document.getElementById('home').style.display = "none"
    document.getElementById('profile').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}

function showUsers() {
    document.getElementById('home').style.display = "none"
    document.getElementById('profile').style.display = "none"
    document.getElementById('usersSection').style.display = "block"

}
//filtring post or tweet
let search = document.getElementById('searchTxt');
search.addEventListener("input", function () {
    let inputVal = search.value.toLowerCase();
    // console.log('Input event fired!', inputVal);
    let noteCards = document.getElementsByClassName('noteCard');
    // console.log(noteCards)
    Array.from(noteCards).forEach(function (element) {
        console.log(element)
        let cardTxt = element.getElementsByTagName("p")[0].innerHTML;
        console.log(cardTxt)
        if (cardTxt.includes(inputVal)) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
        console.log(cardTxt);
    })
})
