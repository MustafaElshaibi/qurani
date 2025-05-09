import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {doc, getDoc, updateDoc, increment, setDoc} from "firebase/firestore";

function ViewsCount({reciter}) {
  const [views, setViews] = useState(0);
  const [loading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchViews = async () => {
      try {
        // Check if reciter and reciter.id exist
        if (!reciter?.id) {
          console.error("Invalid reciter object");
          setIsLoading(false);
          return;
        }

        // Ensure ID is a string
        const reciterId = reciter.id.toString();
        const docRef = doc(db, "reciters", reciterId);
        
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setViews(snapshot.data().views);
        } else {
          // Create document with required fields
          await setDoc(docRef, {
            name: reciter?.name || "Unknown Reciter",
            views: 0,
          });
          setViews(0);
        }
      } catch (error) {
        console.error("Error fetching views:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (reciter) {
      fetchViews();
    }
  }, [reciter]); // Use reciter as dependency




  // increment views count on mount
  useEffect(() => {
    let bounse = null;
  
    const incrementViews = async () => {
      if (!reciter?.id) return;
      try {
        const reciterId = reciter.id.toString();
        const docRef = doc(db, "reciters", reciterId);
        await updateDoc(docRef, { views: increment(1) });
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setViews(snapshot.data().views || 0);
        } 
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };
    if (reciter) {
      bounse = setTimeout(incrementViews, 5000);
    }

    return()=> {
      clearTimeout(bounse);
    }
  }, [reciter]);

  return (
    <>
    {
      loading ? (
        <div className="h-5 bg-gray-700 rounded w-32" />
      )
      : (
        <div  className="text-white  capitalize text-lg max-sm:text-sm ">
     {views.toLocaleString()} monthly listners
    </div>
      )
    }
    </>
  );
}

export default ViewsCount;
