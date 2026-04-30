package Wattmate.Service;

import Wattmate.DTO.LoginRequest;
import Wattmate.DTO.SignupRequest;
import Wattmate.Entity.HouseholdType;
import Wattmate.Entity.TitleMaster;
import Wattmate.Entity.User;
import Wattmate.Repository.TitleMasterRepository;
import Wattmate.Repository.UserRepository;
import Wattmate.Security.JwtTokenProvider;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TitleMasterRepository titleMasterRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       TitleMasterRepository titleMasterRepository,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.titleMasterRepository = titleMasterRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        TitleMaster defaultTitle = titleMasterRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("기본 칭호가 없습니다."));

        User user = new User();
        user.setEmail(request.getUsername());
        user.setPassword(request.getPassword());
        user.setNickname(request.getUsername());
        user.setKepcoCustNo("TEMP");
        user.setHouseholdType(HouseholdType.LIGHT);
        user.setEnergyTemp(36.5f);
        user.setCurrentPoint(0);
        user.setTotalPoint(0);
        user.setTitle(defaultTitle);

        userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return jwtTokenProvider.createToken(user.getEmail());
    }
}