const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
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
					console.log("@@@@@@@@@@@@@@@@@@@@")
					if (response.ok) {
						console.log("@@@@@@@@@@@@@@@@@@@@1")
						const data = await response.json();
						console.log("@@@@@@@@@@@@@@@@@@@@2")
						localStorage.setItem("ptoken", data.ptoken);
						setStore({ ptoken: data.ptoken })
						return true;
					}
				} catch (error) {
					return false;
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
