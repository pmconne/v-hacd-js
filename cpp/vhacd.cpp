#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

#define ENABLE_VHACD_IMPLEMENTATION 1
#define VHACD_DISABLE_THREADING 1
#include "../include/VHACD.h"

using namespace VHACD;

using Parameters = IVHACD::Parameters;

static_assert(sizeof(double *) == 4, "wasm uses 32-bit pointers");

EM_JS(void, consoleLog, (const char* msg), {
  console.log("LOG: " + UTF8ToString(msg));
});

class JsHull {
private:
  IVHACD::ConvexHull const* m_hull;
public:
  explicit JsHull(IVHACD::ConvexHull const* hull) : m_hull(hull) { }

  uint32_t GetPoints() const { return reinterpret_cast<uint32_t>(&(m_hull->m_points[0].mX)); }
  uint32_t GetNumPoints() const { return static_cast<uint32_t>(m_hull->m_points.size()); }
  uint32_t GetTriangles() const { return reinterpret_cast<uint32_t>(&(m_hull->m_triangles[0].mI0)); }
  uint32_t GetNumTriangles() const { return static_cast<uint32_t>(m_hull->m_triangles.size()); }
};

enum MessageType {
  MessageType_None = 0,
  MessageType_Progress = 1,
  MessageType_Log = 2,
  MessageType_All = MessageType_Progress | MessageType_Log,
};

class JsVHACD : IVHACD::IUserCallback, IVHACD::IUserLogger {
private:
  IVHACD* m_vhacd;
  Parameters m_parameters;
public:
  JsVHACD(Parameters const& parameters, MessageType messages) : m_vhacd(CreateVHACD()), m_parameters(parameters) {
    m_parameters.m_asyncACD = false;

    if (MessageType_None != (messages & MessageType_Log))
      m_parameters.m_logger = this;

    if (MessageType_None != (messages & MessageType_Progress))
      m_parameters.m_callback = this;
  }

  ~JsVHACD() {
    m_vhacd->Release();
  }

  void Dispose() {
    delete this;
  }

  void Log(const char* msg) final {
    consoleLog(msg);
  }

  void Update(double overallProgress, double stageProcess, const char* stage, const char* operation) final {
    consoleLog(stage);
    consoleLog(operation);
  }

  std::vector<JsHull> Compute(uint32_t points, uint32_t nPoints, uint32_t triangles, uint32_t nTriangles) {
    std::vector<JsHull> hulls;
    if (!points || !nPoints || !triangles || !nTriangles) {
      return hulls;
    }

    if (m_vhacd->Compute(reinterpret_cast<double const*>(points), nPoints, reinterpret_cast<uint32_t const*>(triangles), nTriangles, m_parameters)) {
      uint32_t nHulls = m_vhacd->GetNConvexHulls();
      for (uint32_t i = 0; i < nHulls; i++)
        hulls.push_back(JsHull(m_vhacd->GetConvexHull(i)));
    }

    return hulls;
  }
};

EMSCRIPTEN_BINDINGS(vhacdjs) {
  class_<JsHull>("ConvexHull")
    // These are functions instead of properties because properties can specify raw pointer policy.
    .function("getPoints", &JsHull::GetPoints, allow_raw_pointers())
    .function("getTriangles", &JsHull::GetTriangles, allow_raw_pointers())
    .property("numPoints", &JsHull::GetNumPoints)
    .property("numTriangles", &JsHull::GetNumTriangles)
    ;

  enum_<FillMode>("FillMode")
    .value("Flood", FillMode::FLOOD_FILL)
    .value("Surface", FillMode::SURFACE_ONLY)
    .value("Raycast", FillMode::RAYCAST_FILL)
    ;

  enum_<MessageType>("MessageType")
    .value("None", MessageType_None)
    .value("All", MessageType_All)
    .value("Log", MessageType_Log)
    .value("Progress", MessageType_Progress)
    ;

  class_<Parameters>("Parameters")
    .constructor()
    .property("maxHulls", &Parameters::m_maxConvexHulls)
    .property("voxelResolution", &Parameters::m_resolution)
    .property("minVolumePercentError", &Parameters::m_minimumVolumePercentErrorAllowed)
    .property("maxRecursionDepth", &Parameters::m_maxRecursionDepth)
    .property("shrinkWrap", &Parameters::m_shrinkWrap)
    .property("fillMode", &Parameters::m_fillMode)
    .property("maxVerticesPerHull", &Parameters::m_maxNumVerticesPerCH)
    .property("minEdgeLength", &Parameters::m_minEdgeLength)
    .property("findBestPlane", &Parameters::m_findBestPlane)
    ;

  class_<JsVHACD>("MeshDecomposer")
    .constructor<Parameters const&, MessageType>()
    .function("compute", &JsVHACD::Compute, allow_raw_pointers())
    .function("dispose", &JsVHACD::Dispose)
    ;

  register_vector<JsHull>("vector<ConvexHull");
}
