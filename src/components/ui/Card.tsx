import{ReactNode}from'react';export function Panel({children,className=''}:{children:ReactNode,className?:string}){return <div className={'glass rounded-3xl p-5 '+className}>{children}</div>}
