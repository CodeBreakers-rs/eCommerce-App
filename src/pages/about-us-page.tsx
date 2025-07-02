import { teamMembers } from '../services/team-members'
import rsLogo from '../assets/svg/logo-rs-school.svg'
import GitHubLogo from '../assets/svg/icon-github.svg'

const AboutUsPage = () => {
  return (
    <div className="bg-[#f6ebdf] py-10 px-4 sm:px-6 text-[#40312d]">
      <div className="max-w-5xl mx-auto">
        {/* Intro Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 text-center sm:text-left">
          <p className="text-sm sm:text-base max-w-3xl">
            The entire development team behind this website came together
            through the <strong>RS School program</strong> – a shared foundation
            that made this project both cohesive and recognizable. Want to learn
            how it all started? Explore the educational journey at{' '}
            <a
              href="https://rs.school/"
              className="font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RS School
            </a>
          </p>
          <div className="bg-white p-2 rounded-full border border-black shadow w-28 sm:w-40 shrink-0">
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={rsLogo}
                alt="RS School Logo"
                className="w-full h-auto rounded-lg object-contain"
              />
            </a>
          </div>
        </div>

        {/* Team Section */}
        <div className="grid gap-6 sm:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-[#f6ebdf] rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Image & GitHub */}
              <div className="relative w-full sm:w-1/3 min-w-[150px] h-60 sm:h-auto">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white rounded-full px-3 py-2 shadow hover:scale-105 transition flex items-center gap-2"
                >
                  <span className="text-xs font-medium text-[#40312d]">
                    {member.name}
                  </span>
                  <img src={GitHubLogo} alt="Github Logo" className="w-4 h-4" />
                </a>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center p-4 sm:p-6 w-full">
                <h3 className="text-lg font-semibold mb-1">{member.role}</h3>
                <p className="text-sm mb-2">{member.bio}</p>
                <p className="text-sm">
                  <span className="font-semibold">📘 Bio:</span> {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage
