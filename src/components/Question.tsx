import React from 'react';
import {Form, Button} from 'react-bootstrap';
import '../styles/MainBox.scss';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


interface prop {
    cookie: string,
    answer: string,
    question: string,
    description: string,
    images?: Array<string>
}

interface submitResponse {
    correct: boolean;
    nextToken: string;
    text: string;
    imageHint?: string;
}

const apiUrl = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? `http://localhost:3080/` : 'https://sciolympiad-api.vmcs.club/';

class Question extends React.Component<{}, prop> {
    constructor(props: any) {
        super(props);
        this.state = {
            cookie: "",
            answer: "",
            question: "",
            description: "",
        }
    }

    checkQuestion = async () => {
        const response = await axios({
            method: 'post',
            url: `${apiUrl}submit`,
            data: {
                answer: this.state.answer,
                progressToken: this.state.cookie,
            }
        });

        const responseData = response.data as submitResponse;

        try {
            await Swal.fire({
                icon: responseData.correct ? 'success' : 'error',
                title: responseData.correct ? "Correct!" : 'Incorrect!',
                text: responseData.text,
                ...responseData.imageHint && {imageUrl: `${apiUrl}images/${responseData.imageHint}`}
            })

            if (responseData.correct) {
                Cookies.set("progressToken", responseData.nextToken);
                this.setState({cookie: responseData.nextToken});
                window.location.reload();
            }

        } catch (err) {
            await Swal.fire({
                icon: 'error',
                title: "Error!",
                text: "Whoops! Something went wrong! Contact a leader for help!"
            });
        }
    };

    async componentDidMount() {
        try {
            let cookieContent = Cookies.get("progressToken");
            if (cookieContent === undefined) {
                Cookies.set("progressToken", "");
                cookieContent = "";
            }
            this.setState({cookie: cookieContent});

            const initial = (await axios({
                method: 'post',
                url: `${apiUrl}question`,
                data: {progressToken: cookieContent}
            })).data;
            this.setState({question: initial.question, description: initial.description, images: initial.images});

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
                        {this.state.images.map((image, i) => <img key={i} alt="question image"
                                                                  src={`data:image/png;base64,${image}`}/>)}
                    </>)}
                </div>
                <div className="boxBottom mt-1">
                    <div className="form d-md-flex d-block">
                        <div className="d-block flex-grow-1 d-sm-flex my-1">
                            <Form.Control className="mx-1 inputField my-1 my-sm-0" placeholder="Answer!"
                                          value={this.state.answer}
                                          onChange={e => this.setState({answer: e.target.value})}>
                            </Form.Control>
                            <Button className="mx-1" onClick={this.checkQuestion}>Submit!</Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default Question;