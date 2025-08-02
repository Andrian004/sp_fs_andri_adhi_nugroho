import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ProjectsNav } from "@/components/navigation/projects-nav";
import { UserNav } from "@/components/navigation/user-nav";
import { ProjectSideNav } from "@/components/navigation/project-side-nav";

const exampleProject = {
  id: "1",
  imageThumbUrl: "https://www.webpreneurly.com/webpreneurly-social-image.png",
  title: "Webpreneurly",
};

export async function ProjectsSideBar() {
  const session = await auth();
  return (
    <Sidebar>
      <SidebarHeader>
        <ProjectsNav project={exampleProject} />
      </SidebarHeader>
      <SidebarContent>
        <ProjectSideNav />
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
