const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			credentials: {
				token: null,
				email: "",
				name: "",
				id: "",
				type: ""
			},

			serviceDescriptions: [{}],

		},
		actions: {

			// SIGIN functions
			signinUser: async (email, password) => {
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
				try {
					if (response.ok) {
						const data = await response.json();
						localStorage.setItem("token", data.token);
						await getActions().getUserDetails();
						return true;
					}
					else {
						alert("Invalid username or password");
					}

				} catch (error) {
					return false;
				}

			},

			getUserDetails: async () => {
				const response = await fetch(process.env.BACKEND_URL + "api/getuser", {
					method: "GET",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem("token")
					}
				})
				if (response.ok) {
					const data = await response.json();
					setStore({ credentials: { token: localStorage.getItem("token"), email: data.user.email, name: data.user.name, id: data.user.id, type: "user" } });
					const credentialsString = JSON.stringify({ token: localStorage.getItem("token"), email: data.user.email, name: data.user.name, id: data.user.id, type: "user" });
					localStorage.setItem("credentials", credentialsString);
					localStorage.removeItem("token");


				}
			},




			signinProvider: async (email, password) => {
				const response = await fetch(process.env.BACKEND_URL + "api/signinprovider", {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password,
					})
				});
				try {
					if (response.ok) {
						const data = await response.json();
						localStorage.setItem("token", data.token);
						await getActions().getProviderDetails();
						return true;
					}
					else {
						alert("Invalid provider username or password");
					}

				} catch (error) {
					return false;
				}

			},


			getProviderDetails: async () => {
				const response = await fetch(process.env.BACKEND_URL + "api/getprovider", {
					method: "GET",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem("token")
					}
				})
				if (response.ok) {
					const data = await response.json();
					setStore({ credentials: { token: localStorage.getItem("token"), email: data.provider.email, name: data.provider.name, id: data.provider.id, type: "provider" } });
					const credentialsString = JSON.stringify({ token: localStorage.getItem("token"), email: data.provider.email, name: data.provider.name, id: data.provider.id, type: "provider" });
					localStorage.setItem("credentials", credentialsString);
					localStorage.removeItem("token");


				}
			},

			signout: () => {
				localStorage.removeItem("credentials");
				setStore({
					credentials: {
						token: null,
						email: "",
						name: "",
						id: "",
						type: ""
					}
				});
			},

			// Onload functions
			// PPRIVATE USER

			getServiceDescriptions: async () => {
				try {
					const url = process.env.BACKEND_URL + "api/servicedescriptions";
					const response = await fetch(url);
					const data = await response.json();
					setStore({ serviceDescriptions: data });
				} catch (error) {
					console.log("Error loading service descriptions", error);
				}
			},



		}
	};
};

export default getState;