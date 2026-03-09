import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "IU Alumni Docs",
    description: "Technical documentation for the IU Alumni platform",
    base: "/docs/",

    themeConfig: {
      logo: "/logo.svg",
      siteTitle: "IU Alumni Docs",

      nav: [
        { text: "Home", link: "/" },
        { text: "Technical", link: "/technical/overview" },
        { text: "Requirements", link: "/requirements/functional" },
        { text: "Sprints", link: "/sprints/sprint-0/team-meeting-1" },
      ],

      sidebar: [
        {
          text: "Technical Documentation",
          collapsed: false,
          items: [
            { text: "System Overview", link: "/technical/overview" },
            { text: "Backend", link: "/technical/backend" },
            { text: "Frontend (Admin Portal)", link: "/technical/frontend" },
            { text: "Mobile App", link: "/technical/mobile" },
            { text: "Infrastructure", link: "/technical/infrastructure" },
          ],
        },
        {
          text: "Requirements",
          collapsed: false,
          items: [
            { text: "Functional Requirements", link: "/requirements/functional" },
            { text: "Quality Attributes", link: "/requirements/quality-attributes" },
            { text: "Use Cases & User Stories", link: "/requirements/use-cases" },
          ],
        },
        {
          text: "Metrics & Analytics",
          collapsed: false,
          items: [
            { text: "Metrics & Analytics", link: "/analytics/metrics" },
          ],
        },
        {
          text: "Sprints",
          collapsed: true,
          items: [
            {
              text: "Sprint 0",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-0/client-meeting-1" },
                { text: "Mentor Meeting", link: "/sprints/sprint-0/mentor-meeting-1" },
                { text: "Retrospective", link: "/sprints/sprint-0/retrospective" },
                { text: "Team Meeting", link: "/sprints/sprint-0/team-meeting-1" },
              ],
            },
            {
              text: "Sprint 1",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-1/client-meeting-1" },
                { text: "Mentor Meeting", link: "/sprints/sprint-1/mentor-meeting-1" },
              ],
            },
            {
              text: "Sprint 2",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-2/client-meeting-1" },
                { text: "Mentor Meeting", link: "/sprints/sprint-2/mentor-meeting-1" },
                { text: "Team Meeting", link: "/sprints/sprint-2/team-meeting-1" },
              ],
            },
          ],
        },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/iu-alumni" },
      ],

      search: {
        provider: "local",
      },

      footer: {
        message: "IU Alumni Platform Documentation",
        copyright: "© 2025 IU Alumni Team",
      },

      editLink: {
        pattern: "https://github.com/iu-alumni/docs/edit/main/src/:path",
        text: "Edit this page on GitHub",
      },
    },

    mermaid: {
      // mermaid config options (optional)
    },
  })
);
