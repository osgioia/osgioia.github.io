import React from 'react'

function Footer() {
  return (
    <div className="text-center w-full mt-16">
      <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
        Made with <span role="img" aria-label="heart">💙</span>
      </p>
      <div className="flex justify-center space-x-6 mb-4">
        <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors duration-300" href="https://osgioia.dev/blog" target="_blank" rel="noopener noreferrer">
          Read my blog
        </a>
        <a className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors duration-300" href={`https://drive.google.com/uc?export=download&id=1KanUgPUhFp92zqyugFGoHv0ABEb4ahoH`} download>
          Download my resume
        </a>
      </div>
    </div>
  )
}

export default Footer