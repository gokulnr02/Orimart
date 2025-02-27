"use client";
import React, { useState } from 'react';

function Button({ className, checkBox, onclick, Name }) {
    const [checked, setChecked] = useState(false);

    return (
        <div className={`${className} btnDiv flexItem`}>
            {checkBox && (
                <input 
                    type='checkbox' 
                    checked={checked} 
                    onChange={(e) => setChecked(e.target.checked)} 
                    className='checkBox' 
                />
            )}
            <button className='btn' onClick={() => onclick(checked)}>{Name}</button>
        </div>
    );
}

export default Button;
