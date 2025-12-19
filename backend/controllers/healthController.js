const mongoose = require('mongoose');

exports.getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const memoryUsage = process.memoryUsage();
    const nodeVersion = process.version;
    const platform = process.platform;

    // Calculate uptime in human readable format
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    const formattedUptime = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

    res.json({
      status: 'healthy',
      uptime: formattedUptime,
      uptimeSeconds,
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      },
      system: {
        nodeVersion,
        platform,
        memoryUsage: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};
