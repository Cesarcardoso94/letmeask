import logoImg from '../assets/images/logo.svg';
import {useParams} from 'react-router-dom'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { FormEvent } from 'react';
import { useEffect } from 'react';

export function Room(){
    type FireBaseQuestions = Record<string, {
        id: string;
        author : {
            name : string;
            avatar : string;
        }
        content: string;
        isAnswered: boolean;
        isHighLighted: boolean;
    }>


    type Question ={
        id : string;
        author : {
            name : string;
            avatar : string;
        }
        content: string;
        isAnswered: boolean;
        isHighLighted: boolean; 
    }

    type RoomParms = {
        id : string;
    }
    const {user} = useAuth();
    const params = useParams<RoomParms>();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle]  = useState('');
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room =>{
            const databaseRoom = room.val()
            const firebaseQuestions : FireBaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,

                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)
        })
    }, [roomId]);

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim() == ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
     }

     const question = {
        content : newQuestion,
        author: {
            name: user.name,
            avatar : user.avatar,
        },
        isHighLigted: false,
        isAnswered: false, 
     };

     await database.ref(`rooms/${roomId}/questions`).push(question);

     setNewQuestion('');

    }

    return(
        <div id="page-room">
            <header>
                <div className = "content">
                <img src={logoImg} alt="Letmeask" />
                <RoomCode code ={params.id}/>
                </div>
            </header>

            <main className ="content">
            <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} perguntas</span>}
            </div>

            <form onSubmit={handleSendQuestion}>
               <textarea
                placeholder = "O que voc?? quer perguntar?"
                onChange = {event => setNewQuestion(event.target.value)}
                value = {newQuestion}
                />
                <div className="form-footer">
                {user ? (
                    <div className="user-info">
                        <img src={user.avatar} alt={user.name} />
                        <span>{user.name}</span>
                    </div>
                ) :
                (<span>Para enviar uma pergunta, <button>fa??a seu login</button></span>
                ) }
                <Button type ="submit" disabled={!user}>Enviar pergunta</Button>

                </div>
            
            </form>
            {JSON.stringify(questions)}

            </main>
        </div>
    )
}