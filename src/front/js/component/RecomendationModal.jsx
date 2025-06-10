import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'
import {GoogleGenAI} from '@google/genai';
import { useEffect } from 'react';
export const RecomendationModal = ({channel, showModal, setShowModal}) => {
    const [recomendation, setRecomendation]= useState()
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

    const getRecomendation = async (channel) => {
        const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: `genera 5 recomendaciones para mejorar mi adquisición de conocimientos, debes tener en cuenta que esto se basa en el test de VAK y mi canal de comunicación es ${channel}.`,
  });
  console.log(response.text);
  setRecomendation(response.text)
    }

    useEffect(()=>{
        if(showModal && channel){
            getRecomendation(channel)
        }
    }, [showModal, channel])
    return (
        <div className="modal fade" id={`recomendations-modal`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Recomendaciones para el canal {channel}</h1>
        <button type="button" onClick={()=> setShowModal(false)} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <ReactMarkdown>{recomendation && recomendation}</ReactMarkdown>
      </div>
      <div className="modal-footer">
        <button type="button"  onClick={()=> setShowModal(false)} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        
      </div>
    </div>
  </div>
</div>
    )
}