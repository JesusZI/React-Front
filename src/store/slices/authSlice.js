import { createSlice } from '@reduxjs/toolkit'


let persisted = { token: null, modules: [] }
try{
  const t = localStorage.getItem('token')
  const m = localStorage.getItem('modules')
  persisted.token = t || null
  persisted.modules = m ? JSON.parse(m) : []
}catch(e){ /* ignore */ }

const initialState = { token: persisted.token, modules: persisted.modules }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action){
      state.token = action.payload.token
     
      try{ localStorage.setItem('token', state.token) }catch(e){}
    
      const raw = action.payload.modules || []
     
      state.modules = raw.map(m => {
        if(!m) return null
        if(typeof m === 'string') return { id: null, code: m, name: m, route: null, position: null, is_render: true }
     
  const normalized = {
    ...m,
    id_module: m.id_module ?? m.id ?? null,
    module: m.module ?? m.code ?? null,
    path: m.path ?? null,
    setting_module_config: {
      key: m.setting_module_config?.key ?? m.module ?? m.code ?? null,
      icon: m.setting_module_config?.icon || null,
      route: m.setting_module_config?.route ?? null,
      position: m.setting_module_config?.position ?? null
    },
    order: m.order ?? 0,
    is_render: m.is_render ?? 0,
    is_render_mobile: m.is_render_mobile ?? 0,
    operations: Array.isArray(m.operations) ? m.operations : []
  }
  return normalized
  }).filter(Boolean)
      try{ localStorage.setItem('modules', JSON.stringify(state.modules)) }catch(e){}
    },
    clearAuth(state){
      state.token = null
      state.modules = []
      try{ localStorage.removeItem('token'); localStorage.removeItem('modules'); localStorage.removeItem('rawModules') }catch(e){}
    }
  }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
