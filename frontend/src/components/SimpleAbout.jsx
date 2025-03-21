import React from 'react';

const SimpleAbout = () => {
  

  const services = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Frontend Development',
      description: 'Building responsive and interactive web applications using React, Redux, and modern CSS frameworks.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      title: 'Backend Development',
      description: 'Creating scalable and secure server-side applications using Node.js, Express, and MongoDB.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI Integration',
      description: 'Implementing machine learning models and AI solutions into web and mobile applications.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'IoT Solutions',
      description: 'Developing interconnected systems with ESP32, Raspberry Pi, and cloud services for smart applications.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-full w-1/5 bg-gray-50 -z-10"></div>
      <div className="absolute right-0 top-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-50 -z-10 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="text-blue-600 font-medium mb-2">About Me</p>
          <h2 className="section-title">Professional <span className="gradient-text">Background</span></h2>
          <div className="title-underline"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Column - Image with decoration */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl transform -rotate-2">
                <img 
                  src="src/assets/images/1742469132056-ajay.jpg" 
                  alt="Ajay coding"
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-blue-600 rounded-lg transform rotate-2 -z-10"></div>
              
              {/* Stats overlay */}
              
            </div>
          </div>

          {/* Right Column - About Text */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-2xl font-bold mb-4">I'm a <span className="text-blue-600">Software Engineer</span> and <span className="text-blue-600">AI Enthusiast</span> passionate about technology</h3>
              
              <p className="text-lg text-gray-700 mb-6">
                I specialize in building innovative solutions that leverage cutting-edge technologies. With expertise in web development, AI integration, and IoT solutions, I'm dedicated to creating impactful products that solve real-world problems.
              </p>
              
              <p className="text-lg text-gray-700 mb-8">
                My journey in technology began with a curiosity about how things work, and this curiosity has evolved into a career where I continually push the boundaries of what's possible. I enjoy the challenge of learning new technologies and applying them to create elegant, efficient, and user-friendly solutions.
              </p>

              {/* Expertise Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">React.js</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">TensorFlow</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">Node.js</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">MongoDB</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">AWS</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">IoT</span>
              </div>

              <div className="flex gap-4">
                <a 
                  href="#contact" 
                  className="btn btn-primary"
                >
                  Contact Me
                </a>
                <a 
                  href="#projects" 
                  className="btn btn-outline"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Services I Offer</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Specialized solutions tailored to meet your technological needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card p-6 hover:translate-y-[-5px] transition-all duration-300">
                <div className="icon-circle mb-4">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleAbout; 