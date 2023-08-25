"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'
import fetchSuggestion from '@/lib/fetchSuggestion'
const Header = () => {

  const [board,searchString,setSearchString] = useBoardStore((state)=>[state.board,state.searchString,state.setSearchString])

  const [loading, setloading] = useState<boolean>(false)
  const [suggestion, setsuggestion] = useState<string>('')
  
  useEffect(() => {
    
    if(board.columns.size===0) return
    // setloading(true)

    const fetchSuggestionFunc=async()=>{
      const suggestion = await fetchSuggestion(board)
      setsuggestion(suggestion)
      setloading(false)
    }
  
    // fetchSuggestionFunc()
    
  }, [board])
  


  return (
    <header>
        <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10'>


          <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50'/>
          
            <Image 
            src={"https://1000logos.net/wp-content/uploads/2021/05/Trello-logo.png"}
            alt='trello logo' 
            height={100} 
            width={300} 
            className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
            />

            <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
                
                 <form action="" className='flex space-x-5 items-center bg-white shadow-md rounded-md p-2 flex-1 lg:flex-initial'>
                     <MagnifyingGlassIcon className='h-6 w-6 text-gray-400'/>
                     <input type="text" value={`${searchString}`} onChange={(e)=>setSearchString(e.target.value)} placeholder='Search' className='flex-1 outline-none p-2'/>
                     <button type='submit' hidden>search</button>
                 </form>

                <Avatar name='haarish khan'  round color='#0055D1' size='50'/>
            </div>
        </div>

        {/* <div className='flex items-center justify-center px-5 py-2 md:py-5'>
            <p className='flex items-center shadow-xl rounded-xl  text-sm font-light pr-5 w-fit bg-white max-w-3xl text-[#0055D1] P-5'>
              <UserCircleIcon className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && "animate-spin"}`}/>
              {suggestion && !loading?suggestion:"Gbt is summarizing your data...."}
            </p>
        </div> */}
    </header>
  )
}

export default Header