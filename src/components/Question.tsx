import React from 'react';
import {Form, Button} from 'react-bootstrap';
import '../styles/MainBox.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

interface prop {
    password: string,
    answer: string,
    question: string,
    description: string,
    path: string,
    images?: Array<string>
}

interface submitResponse {
    correct: boolean;
    text: string;
    imageHint?: string;
}

const apiUrl = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? `http://localhost:3080/` : 'https://sciolympiad-api.vmcs.club/';

class Question extends React.Component<{}, prop> {
    constructor(props: any) {
        super(props);
        this.state = {
            password: "",
            answer: "",
            question: "",
            description: "",
            path: ""
        }
    }

    checkQuestion = () => {
        axios({
            method: 'post',
            url: `${apiUrl}submit/${this.state.path}`,
            data: {
                password: this.state.password,
                answer: this.state.answer
            }
        }).then(response => {
            const responseData = response.data as submitResponse;
            Swal.fire({
                icon: responseData.correct ? 'success' : 'error',
                title: responseData.correct ? "Correct!" : 'Incorrect!',
                text: responseData.text,
                ...responseData.imageHint && {imageUrl: `${apiUrl}images/${responseData.imageHint}`}
            })
        }).catch(err => {
            Swal.fire({
                icon: 'error',
                title: "Error!",
                text: "Whoops! Something went wrong! Contact a leader for help!"
            });
        })
    };

    async componentDidMount() {
        try {
            const path = window.location.pathname.substring(1);
            this.setState({path: path});
            const initial = (await axios({
                method: 'get',
                url: `${apiUrl}question/${path}`
            })).data;
            this.setState({question: initial.question, description: initial.description, images: initial.images});
            if (initial.redirect) {
                window.location.assign(initial.redirect);
            }
        } catch (err) {
            console.log(err);
            this.setState({
                question: "Error loading question!",
                description: "Failed to load question, please try again or contact a leader!"
            });
        }
    }

    render() {
        return (
            <>
                <div className="boxTitle">
                    <h1>{this.state.question}</h1>
                </div>
                <div className="boxContent">
                    <p>{this.state.description}</p>
                    {((this.state.images) && <>
                        <h5>Images:</h5>
                        {this.state.images.map((image, i) => <img key={i} src={`data:image/png;base64,${image}`}/>)}
                    </>)}
                </div>
                <div className="boxBottom">
                    <div className="form d-md-flex d-block">
                        <Form.Control className="mx-1 flex-grow-1 inputField my-1" placeholder="Put your answer here!"
                                      value={this.state.answer}
                                      onChange={e => this.setState({answer: e.target.value})}></Form.Control>
                        <div className="d-block d-sm-flex my-1">
                            <Form.Control className="mx-1 inputField" placeholder="Password!"
                                          value={this.state.password}
                                          onChange={e => this.setState({password: e.target.value})}></Form.Control>
                            <Button className="mx-1" onClick={this.checkQuestion}>Submit!</Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default Question;