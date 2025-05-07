
// export default Response;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Response() {
    const location = useLocation(); // to get data from registration
    const { role } = location.state;

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        textContainer: {
            color: '#080808',
            padding: '5%',
            fontSize:'150%',
            fontWeight: 'bold',
            marginTop:'5%'
        },
        myButton: {
            backgroundColor: '#2d324e',
            color: 'white',
            marginTop: '5%',
            border: 'none',
            width: '10%',
            height: '40px',
            fontSize: '150%',
            cursor: 'pointer',
        },
    };

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/RequestRole');
    };

    return (
        <div style={styles.container}>
            <div style={styles.textContainer}>
                <p style={{marginBottom:'3%'}}>Your request has been submitted,</p>
                <p style={{marginBottom:'3%'}}>For the role: {role}</p>
                <p style={{marginBottom:'3%'}}>Please wait for the response.</p>
            </div>
            <button style={styles.myButton} onClick={handleSubmit}>
                Continue
            </button>
        </div>
    );
}

export default Response;
