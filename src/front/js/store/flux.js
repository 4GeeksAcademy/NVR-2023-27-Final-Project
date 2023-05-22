const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			user: {}

		},
		actions: {
			signinUser: async (email, password) => {
				console.log("@@@@@@@@@@@@@@@@@@@@!")
				const response = await fetch(process.env.BACKEND_URL + "api/signinuser", {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password,
					})
				});
				console.log("@@@@@@@@@@@@@@@@@@@@2")

				try {
					if (response.ok) {
						const data = await response.json();
						console.log("@@@@@@@@@@@@@@@@@@@@2")
						localStorage.setItem("token", data.token);
						setStore({ token: data.token })
						return true;
					}
				} catch (error) {
					return false;
				}
				
			},

			signinProvider: async (email, password) => {
				console.log("@@@@@@@@@@@@@@@@@@@@@@HHHH########");
				const response = await fetch(process.env.BACKEND_URL + "api/signinprovider", {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				});
				console.log("@@@@@@@@@@@@@@@@@@@@@@HHHH########");
				try {
					if (response.ok) {
						const data = await response.json();
						console.log("@@@@@@@@@@@@@@@@@@@@2")
						localStorage.setItem("ptoken", data.ptoken);
						setStore({ ptoken: data.ptoken })
						return true;
					}
				} catch (error) {
					return false;
				}
				
			}
		}
	};
};

export default getState;
