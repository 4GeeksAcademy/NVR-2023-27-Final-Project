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

			// User data structures

			userSettings: null,
			userAddresses: null,
			userExclusions: null,
			userRequests: null,
			userNotifications: null,
			userBookedDays: null,

			providerDetails: null,
			serviceRequestPasswords: null,


			// Provider data structures

			providerAcceptedServices: null,
			providerProvidedServices: null,
			providerAvaiabilities: null,
			providerSettings: null,
			providerNotifications: null,
			providerAddress: null,


			// General data structures

			serviceDescriptions: null,


		},

		actions: {

			// resets providerDetails

			resetProviderDetails: () => {
				setStore({providerDetails: null});
			},

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
				return true;
			},

			calendarModal: (message, backgroundColor, color) => {
				const modalElement = document.createElement("div");
				modalElement.classList.add("calendarModal");

				const closeButton = document.createElement("button");
				closeButton.textContent = "Close";
				closeButton.addEventListener("click", () => {
					modalElement.remove();
				});
				modalElement.appendChild(closeButton);

				const contentElement = document.createElement("div");
				contentElement.textContent = message;
				contentElement.style.backgroundColor = backgroundColor;
				contentElement.style.color = color;
				modalElement.appendChild(contentElement);

				document.body.appendChild(modalElement);
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
						await getActions().getProviderCredentials();
						return true;
					}
					else {
						alert("Invalid provider username or password");
					}

				} catch (error) {
					return false;
				}

			},


			getProviderCredentials: async () => {
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
			},


			//Create service Request

			createServiceRequest: async (serviceRequest) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/createrequest", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						},
						body: JSON.stringify(serviceRequest),
					});

					if (response.ok) {
						const data = await response.json();
						await getActions().getUserBookedDays();
						await getActions().getUserRequests();
						getActions().alertUser("service requested", "yellow", "black");
						return data.id;
					}
				} catch (error) {
					console.error("Error creating request", error);
					return false;
				}
			},


			// Get user's booked days

			getUserBookedDays: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getuserbookeddays", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ userBookedDays: data });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},


			// DELETE Service Request

			deleteServiceRequest: async (serviceRequestId) => {
				try {

					const response = await fetch(process.env.BACKEND_URL + "api/deleteservicerequest/" + serviceRequestId
						, {
							method: "DELETE",
							headers: {
								"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
								"Content-Type": "application/json"
							}
						});

					if (response.ok) {
						const data = await response.json();
						console.log(data.message);
						await getActions().getUserBookedDays();
						await getActions().getUserRequests();
					} else {
						console.log('Error:', response.status);
					}
				} catch (error) {
					console.log('Error:', error);
				}
			},


			// UPDATE and RENEW Service Request

			updateAndRenewServiceRequest: async (serviceRequestId) => {
				try {

					const response = await fetch(process.env.BACKEND_URL + "api/updateandrenewservicerequest/" + serviceRequestId
						, {
							method: "PUT",
							headers: {
								"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
								"Content-Type": "application/json"
							}
						});

					if (response.ok) {
						const data = await response.json();
						await getActions().getUserBookedDays();
						await getActions().getUserRequests();
					} else {
						console.log('Error:', response.status);
					}
				} catch (error) {
					console.log('Error:', error);
				}
			},


			//  Get provider details - for each SERVICE REQUEST

			getProviderDetails: async (providerId) => {
				try {							
				  	const response = await fetch(process.env.BACKEND_URL + "api/getproviderdetails/" + providerId, {
					method: "GET",
					headers: {
					  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
					}
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					setStore({ providerDetails: data.provider_details });
					console.log(data.message);
				  } else {
					console.log("Error:", response.status);
				  }
				} catch (error) {
				  console.log("Error:", error);
				}
			  },
			

			// PRIVATE USER : Get service request passwords

			getServiceRequestPasswords: async (serviceRequestId) => {
				try {							
				  	const response = await fetch(process.env.BACKEND_URL + "api/getservicerequestpasswords/" + serviceRequestId, {
					method: "GET",
					headers: {
					  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
					}
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					setStore({ serviceRequestPasswords: data.service_request_passwords });
					console.log(data.message);
				  } else {
					console.log("Error:", response.status);
				  }
				} catch (error) {
				  console.log("Error:", error);
				}
			  },


			// PRIVATE USER : Rate provider

			rateProvider: async (serviceRequestId, providerId, rating) => {
				try {
				  const response = await fetch(process.env.BACKEND_URL + "api/rateprovider/" + serviceRequestId + "/" + providerId + "/" + rating, {
					method: "PUT",
					headers: {
					  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
					  "Content-Type": "application/json"
					}
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					console.log(data.message);
					await getActions().getUserRequests();
					await getActions().alertUser("provider rated", "#00008B", "white");
				  } else {
					console.log('Error:', response.status);
				  }
				} catch (error) {
				  console.log('Error:', error);
				}
			  },


			// PRIVATE USER : update user settings

			updateUserSettings: async (newUserSettings) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/updateusersettings", {
						method: "PUT",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ newUserSettings })
					});
			
					if (response.ok) {
						const data = await response.json();
						console.log(data.message);
						await getActions().getUserSettings();
						getActions().alertUser("settings updated", "#00008B", "white");
					} else {
						console.log('Error:', response.status);
					}
				} catch (error) {
					console.log('Error:', error);
				}
			},

			// DELETE Delete Exclusion 

			deleteExclusion: async (exclusionId) => {
				try {

					const response = await fetch(process.env.BACKEND_URL + "api/deleteexclusion/" + exclusionId
						, {
							method: "DELETE",
							headers: {
								"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
								"Content-Type": "application/json"
							}
						});

					if (response.ok) {
						const data = await response.json();
						console.log(data.message);
						await getActions().getUserExclusions();
						getActions().alertUser("provider reinstated", "#00008B", "white");
					} else {
						console.log('Error:', response.status);
					}
				} catch (error) {
					console.log('Error:', error);
				}
			},


			// UPDATE service request passwords

			updateServiceRequestPasswords: async (updatedServiceRequestPasswords , serviceRequestId) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/updateservicerequestpasswords/" + serviceRequestId, {
						method: "PUT",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ updatedServiceRequestPasswords: updatedServiceRequestPasswords  })
					});
			
					if (response.ok) {
						const data = await response.json();
						console.log(data.message);
						await getActions().getUserRequests();
						getActions().alertUser("passwords updated", "#00008B", "white");
					} else {
						console.log('Error:', response.status);
					}
				} catch (error) {
					console.log('Error:', error);
				}
			},


			// POST Exclude provider

			excldueProvider: async (providerId) => {
				try {
				  const response = await fetch(process.env.BACKEND_URL + "api/excludeprovider/" + providerId, {
					method: "POST",
					headers: {
					  "Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token,
					  "Content-Type": "application/json"
					}
				  });
			  
				  if (response.ok) {
					const data = await response.json();
					console.log(data.message);
					await getActions().getUserExclusions();
					await getActions().alertUser("provider excluded", "#00008B", "white");
				  } else {
					console.log('Error:', response.status);
				  }
				} catch (error) {
				  console.log('Error:', error);
				}
			  },

			  
			  //*********************************/
			  // Private Provider functions 


  			  // GET  Provider Accepted Services 
			  getProviderAcceptedRequests: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getprovideracceptedservicerequests", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({ providerAcceptedServices: data.provider_accepted_service_requests });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("An error occurred:", error);
				}
			},


			// GET  Provider Provided Services 
			getProviderProvidedServices: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getproviderprovidedservices", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({ providerProvidedServices: data.provider_provided_services });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("An error occurred:", error);
				}
			},


			// GET  Provider Avaiabilities
			
			getProviderAvailabities: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getprovideravaiabilities", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({ providerAvaiabilities: data.provider_availabilities });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("An error occurred:", error);
				}
			},

			// GET  Provider Notifications

			getProviderNotifications: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getprovidernotifications", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data);
						setStore({ providerNotifications: data.provider_notifications });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("An error occurred:", error);
				}
			},
			

			// GET  Provider settings

			getProviderSettings: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getprovidersettings", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token

						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ providerSettings: data.provider_settings });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},


			// GET  Provider Address

			getProviderAddress: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/getprovideraddress", {
						method: "GET",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token

						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ providerAddress: data.provider_address });
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},


			// PUT update Service RAdius

			updateServiceRadius: async (newServiceRadius) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "api/updateserviceradius/" + newServiceRadius, {
						method: "PUT",
						headers: {
							"Authorization": "Bearer " + JSON.parse(localStorage.getItem("credentials")).token
						}
					});

					if (response.ok) {
						await getActions().getProviderSettings();
						await getActions().alertUser("radius updated", "#00008B", "white");
					} else {
						console.log("Error:", response.status);
					}
				} catch (error) {
					console.log("Error:", error);
				}
			},



		}
	};
};

export default getState;