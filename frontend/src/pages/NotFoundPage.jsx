import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className='h-svh flex flex-col'>
            <header className='p-4 flex items-center justify-between border-b'>
                <Link to="/" className='font-bold'>NotHub</Link>
            </header>
            <div className='w-full flex-1 flex flex-col gap-4 items-center justify-center'>
                <div>
                    <img src="/404-not-found.svg" alt="404 not found" />
                </div>
                <div className='grid grid-cols-2 w-52 gap-2 '>
                    <Button variant="secondary" onClick={() => navigate('/login')}>Login</Button>
                    <Button variant="secondary" onClick={() => navigate('/signup')}>Register</Button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage