import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button';
import {useHistory} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { database } from '../services/firebase';
import { useState } from 'react';


export function Home(){
    const history = useHistory();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }    
        history.push('/rooms/new');    
    }

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault();
        if(roomCode.trim() === ''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

       history.push('/rooms/${roomCode}')

     }
    

    return(
        <div id="page-auth">
            <aside>
                 <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A Ao-vivo</strong>
                <p>Tire suas dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room"> 
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                        type="text" 
                        placeholder="Digite o código da Sala"
                        onChange = {event => setRoomCode(event.target.value)}
                        value = {roomCode}
                         />
                        <Button type="submit">
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}


