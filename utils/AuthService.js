import api from './api'

const version = 1.1;
export default class AuthService{
    
	static isLoggin = ()=>{
		// Checks if there is a saved token and it's still valid
		var token = this.getToken()
		if(token === 'undefined'){
			token = null;
			localStorage.removeItem('token');
			localStorage.removeItem('profile');
			localStorage.removeItem('pass');
			localStorage.removeItem('version');
		}
		return token && true  // handwaiving here
	}

	static validateVersion = ()=>{
		let v = localStorage.getItem('version')
		if(this.isLoggin() && v != version){
			localStorage.clear();
			location.reload();
		}
	}

	static setProfile = profile =>{
		// Saves profile data to localStorage
		localStorage.setItem('profile', JSON.stringify(profile))
		localStorage.setItem('version', version)
	}
	
	static getProfile = ()=>{
		// Retrieves the profile data from localStorage
		const profile = localStorage.getItem('profile')
		return profile ? JSON.parse(localStorage.profile) : null
	}
	
	static setToken =token =>{
		// Saves user token to localStorage
		localStorage.setItem('token', token)
	}
	
	static getToken = ()=>{
		// Retrieves the user token from localStorage
		return localStorage.getItem('token')
	}
	
	static logout = () =>{
		// Clear user token and profile data from localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('profile');
		localStorage.removeItem('pass');
		localStorage.removeItem('version');
	}

	static login = (data,callback) =>{
		api.login(data)
		.then(res => {
			console.log(res);
			const {data} = res;
			AuthService.setToken(data.token);
			AuthService.setProfile(data.user);
			callback(true);
			//window.localStorage.setItem('token',data.token)
			//console.log(AuthService.getProfile())
			//Router.push('/')
			
		})
		.catch(err => {
				callback(false,err);
			//console.log(err.response);
		})
	}
	static loginGoogle = (gg_token,callback) =>{
		api.loginGoogle(gg_token)
		.then(res => {
			const data = res.data;
			AuthService.setToken(data.token)
			AuthService.setProfile(data.user);
			callback(true);
		})
		.catch(err => {
			//console.log(err.response);
			callback(false,err.response);
		})
	}
	static loginFacebook = (fb_token,callback) =>{
		api.loginFacebok(fb_token)
		.then(res => {
			const data = res.data;
			// console.log('facebook', data)
			if(data.required_info == 1){
				// console.log('A')
				this.requireInfo(data)
				callback(false);
			}else{
				// console.log('B')
				AuthService.setToken(data.token)
				AuthService.setProfile(data.user);
				callback(true);
			}
		})
		.catch(err => {
			callback(false,err.response);
		})
	}
	static loginLine = (callback) =>{
		// var i = 0;
		//'http://cu.degitobangkok.com/'
		//https://newsite.chulabook.com/
		if(!window) return;
		const origin = window.location.origin;
		const url = encodeURIComponent(origin+'/linecallback')
		var win = window.open(`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1653458799&redirect_uri=${url}&state=12345abcde&scope=openid%20profile%20email&nonce=09876xyz`, 'sharer', 'toolbar=0,status=0,width=600,height=800');
		
		var listener = function(event){
			if (event.origin !== origin)
				return;
			if(event.data.error){
				callback(false,event.data.error)
				//Handle error
				return;
			}
			if(!event.data.token){
				return;
			}
			
			const data = event.data;
			AuthService.setToken(data.token)
			AuthService.setProfile(data.user);
			//window.localStorage.setItem('token',data.token)
			console.log(AuthService.getToken())
			window.removeEventListener('message',listener);
			clearInterval(timer);
			return callback(true)
			//alert(event.data.access_token)
		}
		window.addEventListener("message", listener);
		//On user close the popup window
		var timer = setInterval(function() {
			if(win.closed) {
				clearInterval(timer);  
				
				window.removeEventListener('message',listener);
				return callback(false,'user closed')
			}  
		}, 1000); 
	}
	static requireInfo = (param) =>{
		if(!param.email){

			const [firstname , lastname] = param.user_social.name.split(" ");
			const {provider,access_token,line_code} = param.user_social

			let token
			if(provider == "google"){
				token = access_token
			}else if(provider == "line"){
				token = line_code
			}else if(provider == "facebook"){
				token = access_token
			}
			localStorage?.setItem('user', `{
				"firstname": "${firstname}",
				"lastname": "${lastname ? lastname:""}",
				"email": "${param.user_social.email}",
				"phone" : "${param.user_social.phone ? param.user_social.phone:""}",
				"provider":"${param.user_social.provider}",
				"picture": "${param.user_social.picture}",
				"social_id": "${param.user_social.id}",
				"access_token": "${token}"
			}`);
			window.location.replace('/register')
			
		}else{
			console.log('else')
		}
	}
}