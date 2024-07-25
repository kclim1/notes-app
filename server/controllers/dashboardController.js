exports.dashboard = async (req, res) => {
    try {
      const locals = {
        title: "Dashboard",
        description: "A full stack notes app dashboard"
      };
      res.render('dashboard', {
        locals,
        layout: 'layouts/dashboard' // Specify the dashboard layout
      });
    } catch (error) {
      res.status(500).send("error loading dashboard");
    }
  };
  