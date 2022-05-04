import React, { useState } from 'react';
import PropTypes from 'prop-types'  

const Button = ({color, text, onClick, to}) => {

    
    return (
        <a href={to}>
            <button 
                className='btn' 
                style={{backgroundColor: color}}
                onClick = {onClick}
            >
                {text}
            </button>
        </a>
    )
}
 
Button.defaultProps = {
    color: 'blue',
    text: ''
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    onClick: PropTypes.func,
}
export default Button