export default function usbConnection(){
    async function connectToDevice() {
			try {
				// Request USB device access
				const filters = [{ vendorId: 0x0483 }]; // Add your vendor ID
				const device = await navigator.usb.requestDevice({ filters });

				alert("Device requested");

				// Open the device
				await device.open();
				alert("Device opened");

				// Select a configuration (you may need to adjust the configuration number)
				await device.selectConfiguration(1);
				alert("Configuration selected");

				// Claim an interface (you may need to adjust the interface number)
				await device.claimInterface(1);
				alert("Interface claimed");
				// endpointIn = 1
				// endpointOut = 3

				// Get endpoints for communication
				const interfaceInfo = device.configuration.interfaces[1];
				interfaceInfo.alternate.endpoints.forEach((endpoint) => {
					if (endpoint.direction === "in") {
						endpointIn = endpoint;
					} else if (endpoint.direction === "out") {
						endpointOut = endpoint;
					}
				});

				alert("in : " + endpointIn + " out : " + endpointOut);
				alert("Endpoints obtained");

				usbDevice = device;
				messagesDiv.innerHTML = "Connected to USB device.";
			} catch (error) {
				console.error("Error connecting to USB device:", error);
				alert("Error connecting to USB device.");
				messagesDiv.innerHTML = "Error connecting to USB device.";
			}
		}

		async function writeData() {
			try {
				// Your hex message
				let hexMessage = "001600004447432D32303230";
				if (ReversedString.checked) {
					hexMessage = reverseString(hexMessage);
				}
				// Convert hex string to byte array
				const byteArray = hexStringToByteArray(hexMessage);

				// Write data to the USB device
				await usbDevice.transferOut(
					endpointOut.endpointNumber,
					new Uint8Array(byteArray)
				);

				const datasent = String(new Uint8Array(byteArray));

				messagesDiv.innerHTML = "Data sent to USB device." + datasent;
			} catch (error) {
				console.error("Error writing data to USB device:", error);
				messagesDiv.innerHTML = "Error writing data to USB device.";
			}
		}

		function hexStringToByteArray(hexString) {
			const bytes = [];
			for (let i = 0; i < hexString.length; i += 2) {
				bytes.push(parseInt(hexString.substr(i, 2), 16));
			}
			return bytes;
		}

		async function readData() {
			try {
				// Receive data from the USB device
				const result = await usbDevice.transferIn(
					endpointIn.endpointNumber,
					64
				);
				const receivedData = new TextDecoder().decode(result.data.buffer);
				messagesDiv.innerHTML = `Received data: ${receivedData}`;
			} catch (error) {
				console.error("Error reading data from USB device:", error);
				messagesDiv.innerHTML = "Error reading data from USB device.";
			}
		}

		function reverseString(str) {
			let reversed = "";
			for (let i = 0; i < str.length; i += 2) {
				const elem = str.substr(i, 2);
				reversed = elem + reversed;
			}
			return reversed;
		}

		connectButton.addEventListener("click", () => {
			if (!usbDevice) {
				connectToDevice();
			} else {
				messagesDiv.innerHTML = "Already connected to USB device.";
			}
		});

		writeDataButton.addEventListener("click", () => {
			if (usbDevice) {
				writeData();
			} else {
				messagesDiv.innerHTML = "Not connected to USB device.";
			}
		});

		readDataButton.addEventListener("click", () => {
			if (usbDevice) {
				readData();
			} else {
				messagesDiv.innerHTML = "Not connected to USB device.";
			}
		});
}