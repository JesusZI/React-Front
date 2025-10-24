import React, { useEffect, useState, useRef } from 'react'
import { Box, Grid, Card, CardMedia, CardContent, Typography, Modal, Button } from '@mui/material'
import axios from 'axios'

export default function External(){
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [modalWidth, setModalWidth] = useState(null)
  const containerRef = useRef(null)


  useEffect(() => {
    try{
      if(open){
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }catch(e){}
    return () => { try{ document.body.classList.remove('modal-open'); }catch(e){} };
  }, [open]);

  useEffect(()=>{
    // Usaré la API pública de SuperHero: https://akabab.github.io/superhero-api/api/
    const fetchData = async ()=>{
      try{
        const res = await axios.get('https://akabab.github.io/superhero-api/api/all.json')
        setItems(res.data.slice(0, 20))
      }catch(err){ console.error(err) }
    }
    fetchData()
  },[])

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">External</h5>
          <div className="row mb-12 g-6">
          {items.map(item => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100">
                { (item.images?.sm || item.images?.md) && (
                  <img className="card-img-top" src={item.images?.md || item.images?.sm} alt={item.name} />
                ) }
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.biography?.fullName || item.biography?.publisher || 'No description available.'}</p>
                  <a
                    href="#"
                    className="btn btn-outline-primary"
                    onClick={(e)=>{
                      e.preventDefault();
                    
                      try{
                        const container = containerRef.current;
                        if(container){
                          const rect = container.getBoundingClientRect();
                          const maxAllowed = Math.floor(Math.min(rect.width, window.innerWidth * 0.95));
                          setModalWidth(maxAllowed);
                        } else {
                          setModalWidth(null);
                        }
                      }catch(err){ setModalWidth(null) }
                      setSelected(item);
                      setOpen(true);
                    }}
                  >Details</a>
                </div>
              </div>
            </div>
          ))}
          </div>

          {open && selected && (
          <>
            <div className="modal fade show custom-modal" style={{display: 'block'}} tabIndex="-1" role="dialog" aria-modal="true">
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                    style={ modalWidth ? { maxWidth: `${modalWidth}px`, width: '100%' } : undefined }
                  >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selected.name}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={()=>{ setOpen(false); setModalWidth(null); }}></button>
                  </div>
                  <div className="modal-body">
                    {selected.images?.lg && (
                      <div className="text-center mb-3">
                        <img src={selected.images.lg} alt={selected.name} className="img-fluid mx-auto" style={{ maxHeight: '60vh', width: 'auto' }} />
                      </div>
                    )}
                    <p><strong>Full Name:</strong> {selected.biography?.fullName || '—'}</p>
                    <p><strong>Publisher:</strong> {selected.biography?.publisher || '—'}</p>
                    <p><strong>Place of birth:</strong> {selected.biography?.placeOfBirth || '—'}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={()=>{ setOpen(false); setModalWidth(null); }}>Close</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show custom-backdrop"></div>
          </>
          )}
        </div>
      </div>
    )
}
