import { teamMembers } from '../services/team-members'
import rsLogo from '../assets/svg/logo-rs-school (1).svg'
import GitHubLogo from '../assets/svg/icon-github.svg'

const AboutUsPage = () => {
  return (
    <div className="bg-[#f6ebdf] py-10 px-6 text-[#40312d]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-10">
          <p className="text-md sm:text-lg  max-w-3xl">
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
          <div className="bg-white p-2 rounded-full border-2 border-black shadow inline-flex">
            <a
              href="https://rs.school/"
              className="font-semibold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={rsLogo}
                alt="RS School Logo"
                className="w-40 h-auto rounded-xl"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex bg-[#f6ebdf] rounded-xl shadow-md overflow-hidden max-w-2xl w-full"
            >
              <div className="relative w-1/3 min-w-[150px]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover h-full w-full"
                />
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white rounded-full px-3 py-2 shadow hover:scale-105 transition flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-[#40312d]">
                    {member.name}
                  </span>
                  <img src={GitHubLogo} alt="Github Logo" className="w-5 h-5" />
                </a>
              </div>
              <div className="flex flex-col justify-center p-6 w-2/3">
                <h3 className="text-lg font-semibold mb-1">{member.role}</h3>
                <p className="text-sm mb-2 leading-snug">{member.bio}</p>
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
