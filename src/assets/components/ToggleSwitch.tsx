const toggleMotor = async (pin) => {
    try {
        const response = await fetch('http://your-esp32-ip-address/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pin }),
        });
        if (response.ok) {
            console.log(`Motor pin ${pin} toggled successfully`);
        } else {
            console.error('Failed to toggle motor pin');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export default toggleMotor;
