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

			userSettings: null,
			userAddresses: null,
			userExclusions: null,
			userRequests: null,
			userNotifications: null,
			serviceDescriptions: null,


		},
		actions: {

			// Displays Alerts, available to every other method 
			alertUser: (message, backgroundColor, color) => {
				const alertElement = document.createElement("div");
				alertElement.classList.add("alertUser");
				alertElement.textContent = message;
				alertElement.style.backgroundColor = backgroundColor;
				alertElement.style.color = color;
				document.body.appendChild(alertElement);
				setTimeout(() => {
					alertElement.remove();
				}, 2100);
			},

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

			getUserSettings: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getusersettings", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token

						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userSettings: data.user_settings });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},

			getUserAddresses: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getuseraddresses", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token

						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userAddresses: data.user_addresses });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},

			getUserExclusions: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getuserexclusions", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token

						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userExclusions: data.user_exclusions });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},

			getUserRequests: async () => {
				try {
				  const response = await fetch(process.env.BACKEND_URL + "api/getuserservicerequests", {
					method: "GET",
					headers: {
					  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
					}
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					console.log(data);
					setStore({ userRequests: data.user_requests });
				  } else {
					console.log("Error:", response.status);
				  }
				} catch (error) {
				  console.log("An error occurred:", error);
				}
			  },
			  

			getUserNotifications: async () => {
				const response = await fetch(process.env.BACKEND_URL + "api/getusernotifications", {
					method: "GET",
					headers: {
						"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
					}
				});

				if (response.ok) {
					const data = await response.json();
					console.log(data);
					setStore({ userNotifications: data.notifications });
				} else {
					console.log("Error:", response.status);
				}
			}




		}
	};
};

export default getState;