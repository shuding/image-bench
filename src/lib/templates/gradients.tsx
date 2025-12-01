export function Gradients() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
        fontSize: 60,
        letterSpacing: -2,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      <div
        style={{
          maskImage:
            "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
        }}
      >
        Develop
      </div>
      <div
        style={{
          maskImage:
            "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
        }}
      >
        Preview
      </div>
      <div
        style={{
          maskImage:
            "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
        }}
      >
        Ship
      </div>
    </div>
  );
}
