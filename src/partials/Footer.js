import React from 'react'

function Footer() {
  return (
    <div className="text-center w-full mt-16">
      <p className="text-gray-600 mb-4">
        Made with <span role="img" aria-label="heart">💙</span>
      </p>
      <a className="text-blue-500 hover:underline" href={`https://drive.google.com/uc?export=download&id=1KanUgPUhFp92zqyugFGoHv0ABEb4ahoH`} download>Download my resume</a>
    </div>
  )
}

export default Footer