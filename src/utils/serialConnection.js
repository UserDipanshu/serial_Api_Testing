export default async function toggleSerialConnection() {
    let port = null;
    let response = "Empty response...."

	try {
		console.log("function called");
		if (port) {
			// If a port is already open, close it
			await port.close();
			port = null; // Reset the port reference
			// connectButton.textContent = "Connect"; // Update button text
			// dataContainer.textContent = ""; // Clear data container
		} else {
			// Request serial port access
			port = await navigator.serial.requestPort();

			// Open the port with a specific baud rate
			await port.open({ baudRate: 9600 });
			// connectButton.textContent = "Disconnect"; // Update button text

			// Get a writer to send data to the serial port
			const writer = port.writable.getWriter();

			// Send a hex message to the serial port
			let hexMessage = "001600004447432D32303230";
			// if (ReversedString.checked) {
			// 	hexMessage = reverseString(hexMessage);
			// }

			const byteArray = hexStringToByteArray(hexMessage);
			await writer.write(new Uint8Array(byteArray));

			// Get a reader to receive data from the serial port
			const reader = port.readable.getReader();
			const { value, done } = await reader.read();

			if (!done) {
				// Convert the received hex data to ASCII characters
				const receivedASCII = hexStringToASCII(byteArrayToHexString(value));
				// dataContainer.textContent = "Received: " + receivedASCII;
                response = receivedASCII;
                // console.log("received ", receivedASCII);
			}

			// Close the writer and reader
			writer.releaseLock();
			reader.releaseLock();
		}
	} catch (error) {
        response = "Something went wrong during connection..."
		console.error("Error:", error.message);
	}finally{
        return response
    }
}

function hexStringToByteArray(hexString) {
	const bytes = [];
	for (let i = 0; i < hexString.length; i += 2) {
		bytes.push(parseInt(hexString.substr(i, 2), 16));
	}
	return bytes;
}

// Helper function to convert a byte array to a hex string
function byteArrayToHexString(byteArray) {
	return Array.from(byteArray, (byte) =>
		byte.toString(16).padStart(2, "0")
	).join("");
}

// Helper function to convert a hex string to ASCII characters
function hexStringToASCII(hexString) {
	let result = "";
	for (let i = 0; i < hexString.length; i += 2) {
		const hexCharCode = parseInt(hexString.substr(i, 2), 16);
		result += String.fromCharCode(hexCharCode);
	}
	return result;
}

function reverseString(str) {
	let reversed = "";
	for (let i = 0; i < str.length; i += 2) {
		const elem = str.substr(i, 2);
		reversed = elem + reversed;
	}
	return reversed;
}
