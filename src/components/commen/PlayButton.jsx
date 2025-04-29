import { FaPlay } from 'react-icons/fa';
import Cookies from 'universal-cookie';
import ModualSignIn from '../uncommen/ModualSignIn';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { playTrack } from '../../rtk/Reducers/PlayerReducer';
const cookie = new Cookies();



function PlayButton({onClick, surahQueue, w, h, p}) {
  const token = cookie.get("auth-token");
    const [showSignInModal, setShowSignInModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handlePlayList = ()=> {
    if(!token) {
      setShowSignInModal(true);
      return;
    } 

    dispatch(playTrack({
      surah: surahQueue[0],
      queue: surahQueue,
      context: 'playList'
    }))
  }
  return (
   <>
    <ModualSignIn
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={() => navigate('/login')}
      />
    <div onClick={handlePlayList} className={`play transition-all duration-300 rounded-full hover:bg-green-500 bg-green-400  cursor-pointer flex items-center justify-center`} style={{width: w, height: h}}>
    <FaPlay className='text-black' style={{width: p, height: p}} />
  </div>
   </>
  )
}

export default PlayButton