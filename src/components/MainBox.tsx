import React from 'react';
import Question from './Question';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/MainBox.scss';


const MainBox = () => {
    return (
        <div className="mainBox">
            <Question/>
        </div>
    );
};

export default MainBox;