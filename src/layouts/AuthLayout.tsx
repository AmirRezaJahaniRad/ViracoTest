import { ToastContainer } from "react-toastify"
import earth from "../assets/images/earth.png"
import { Card , CardContent , Box } from "@mui/material";
import ParticleEffect from "../components/ui/ParticleEffect";

interface MyComponentProps {
  children : React.ReactNode;
}

const AuthLayout : React.FC<MyComponentProps> = ({ children }) => {
  return (
    <Box className="h-screen relative">
            <ToastContainer rtl={true}/>
            <ParticleEffect></ParticleEffect>
            <Box className="w-full main-auth-div relative z-10"> 
                <section className="grid items-center justify-center w-full md:grid-cols-2"> 
                    <div className="flex opacity-80 md:w-full items-center justify-center">
                        <img className="w-1/2 p-1 object-cover md:object-contain md:w-full md:h-screen rounded-xl" src={earth} alt="Earth"/>
                    </div>
                    <div className="flex justify-center mr-5 mt-3">
                      <Card className="w-2/3" sx={{
                        borderRadius : "14px",
                        padding : "0.25vw",
                        bgcolor : theme => theme.palette.cardBackground.main
                      }}>
                        <CardContent className="flex flex-col items-center justify-center" >
                            { children }
                        </CardContent>
                      </Card>
                    </div>
                </section>
            </Box>
      </Box>
  )
};

export default AuthLayout;