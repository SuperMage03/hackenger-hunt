import React from 'react';
import { Form, Button } from 'react-bootstrap';
import '../styles/MainBox.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

interface prop{
    password: string,
    answer: string,
    question: string,
    description: string,
    path: string,
    imagePaths : Array<string>
}

class Question extends React.Component<{}, prop>{
    constructor(props : any){
        super(props);
        this.state = {
            password: "",
            answer: "",
            question: "",
            description: "",
            path: "",
            imagePaths: []
        }
    }
    checkQuestion = () => {
        console.log(this.state.path);
        axios({
            method: 'post',
            url: `http://localhost:3080/submit/${this.state.path}`,
            data:{
                password: this.state.password,
                answer: this.state.answer
            }
        }).then(response => {
            Swal.fire({
                icon: (response.data == true) ? 'success' : 'error',
                title: (response.data == true) ? "Correct!" : 'error'
            })
        }).catch(err => {
            Swal.fire({
                icon: 'error',
                title: "Error!",
                text: "Whoops! Something went wrong! Contact a leader for help!"
            });
        })
    };
    async componentDidMount(){
        try{
            const path = window.location.pathname.substring(1);
            this.setState({path: path});
            const initial = (await axios({
                method: 'get',
                url: `http://localhost:3080/question/${path}`
                })).data;
            this.setState({question: initial.question, description: initial.description});
        }
        catch(err){
            console.log(err);
            this.setState({question: "Error loading question!", description: "Failed to load question, please try again or contact a leader!"});
        }
    }
    render(){
        return(
            <>
            <div className="boxTitle">
                <h1>{this.state.question}</h1>
            </div>
            <div className="boxContent">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis facilis commodi, omnis rerum repellat a quae iste fugit illo nam, eius libero minus distinctio officiis corrupti. Voluptatum vero earum nobis! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero similique aliquid ullam adipisci impedit ipsa tempore, necessitatibus labore eius? Neque pariatur soluta aliquid natus. Nisi reiciendis quibusdam placeat id voluptatum! Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint fuga adipisci quo neque molestias veniam voluptatem aspernatur ut ipsum reiciendis! Voluptatibus, assumenda veniam eligendi deserunt iusto soluta. Eaque, nam minima.</p>
            </div>
            <div className="boxBottom">
                <div className="form d-md-flex d-block">
                    <Form.Control className="mx-1 flex-grow-1 inputField my-1" placeholder="Put your answer here!" value={this.state.answer} onChange={e=>this.setState({answer: e.target.value})}></Form.Control>
                    <div className="d-block d-sm-flex my-1">
                        <Form.Control className="mx-1 inputField" placeholder="Password!" value={this.state.password} onChange={e=>this.setState({answer: e.target.value})}></Form.Control>
                    <Button className="mx-1"onClick={ this.checkQuestion }>Submit!</Button>
                    </div>
                </div>
            </div>
            </>
        );
    }
};

export default Question;