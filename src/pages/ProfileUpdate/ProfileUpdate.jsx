import React, { useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';

const ProfileUpdate = () => {

  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [uid, setUid] = useState('');
  const [avatar, setAvatar] = useState('');

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {

      if (!avatar && !image) {
        toast.error("Upload profile picture");
      }

      const docRef = doc(db, 'user', uid);

      if(image){

        const imgUrl = await upload(image);
        setAvatar(imgUrl);
        await updateDoc(docRef,{
          avatar: imgUrl,
          bio: bio,
          name: name
        })
      }else{
        await updateDoc(docRef,{
          bio: bio,
          name: name
        })
      }
      const snap = await getDoc(docRef);
      setuserData(snap.data());
      navigate('/chat');
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Effect hook to convert file to object URL
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        setUid(user.uid);
        const docref = doc(db, 'user', user.uid);
        const docSnap = await getDoc(docref);
        console.log("data: " + docSnap.data().avatar);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setAvatar(docSnap.data().avatar);
        }
      }else{
        navigate('/');
      }
    })
  })

  useEffect(() =>{
    // Cleanup function to revoke the object URL
    return () => {
        if(image) {
          URL.revokeObjectURL(image);
        }
    }
  },[image])

  return (
    <div className='profile'>
        <div className="profile-container">
            <form onSubmit={profileUpdate}>
                <h3>Profile Details</h3>
                <label htmlFor="avatar">
                    <input onChange={(e) => setImage(e.target.files[0]) } type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
                    <img src={avatar ? avatar : (image ? URL.createObjectURL(image) : assets.avatar_icon)} alt="" />
                    {avatar ? "change" : "upload"} profile image
                </label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' required />
                <textarea onChange={(e) => setBio(e.target.bio)} value={bio} placeholder='Write profile bio here...' required></textarea>
                <button type='submit'>Save</button>
            </form>
            <img className='profile-pic' src={avatar ? avatar : (image ? URL.createObjectURL(image) : assets.logo_icon)} alt="" />
        </div>
    </div>
  )
}

export default ProfileUpdate
