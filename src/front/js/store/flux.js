const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: {},
			credentials: {
				token: null,
				email: "",
				name: "",
				id: "",
				type: ""
			}
		},
		actions: {
			getUserDetails: async () => {
				const response = await fetch(process.env.BACKEND_URL + "api/getuser", {
					method: "GET",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem("token")
					}
				})
				if (response.ok) {
					const data = await response.json();
					setStore({ user: data.user });
					setStore({ credentials: { token: localStorage.getItem("token"), email: data.user.email, name: data.user.name, id: data.user.id, type: "user" } });
				}
			},

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

			signinProvider: async (email, password) => {
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
				try {
					if (response.ok) {
						const data = await response.json();
						localStorage.setItem("token", data.token);
						await getActions().getProviderDetails();
						return true;
					} else {
						alert("Invalid username or password");
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
					setStore({ user: data.provider });
					setStore({ credentials: { token: localStorage.getItem("token"), email: data.provider.email, name: data.provider.name, id: data.provider.id, type: "provider" } });
				}
			},

			signout: () => {
				localStorage.removeItem("token");
				setStore({
					user: {}, credentials: {
						token: null,
						email: "",
						name: "",
						id: "",
						type: ""
					}
				});
			}


		}
	};
};

export default getState;